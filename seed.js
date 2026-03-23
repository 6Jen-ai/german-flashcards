/**
 * seed.js — Populate Firestore `vocabulary` collection from A1 Wordlist.csv
 *
 * Prerequisites:
 *   npm install firebase-admin
 *
 * Place your Firebase service account key as:
 *   ./serviceAccountKey.json
 * (Download from Firebase Console → Project Settings → Service Accounts → Generate new private key)
 *
 * Usage:
 *   node seed.js
 *
 * Rules:
 *  - Only upserts `vocabulary` docs — NEVER touches `user_progress`.
 *  - Smart sectioning: groups of 10. If last group < 10, merges with previous.
 *  - Safe to re-run after CSV updates.
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// ── Firebase Init ──────────────────────────────────────────────────────────
// Support both serviceAccountKey.json and serviceAccountKey.json.json
let serviceAccount;
try { serviceAccount = require('./serviceAccountKey.json'); }
catch { serviceAccount = require('./serviceAccountKey.json.json'); }

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'flashcard-de',
});

const db = getFirestore();

// ── CSV Parser ─────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');

  const words = [];
  for (let i = 1; i < lines.length; i++) { // skip header
    const line = lines[i];
    // Handle quoted fields (e.g. "you (accusative, informal)")
    const cols = [];
    let inQuote = false;
    let cur = '';
    for (const ch of line) {
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());

    if (cols.length >= 2 && cols[0]) {
      words.push({ de: cols[0], en: cols[1] || '' });
    }
  }
  return words;
}

// ── Smart Sectioning ───────────────────────────────────────────────────────
function assignSections(words, wordsPerSection = 10) {
  const totalWords = words.length;
  const fullSections = Math.floor(totalWords / wordsPerSection);
  const remainder = totalWords % wordsPerSection;

  // If remainder < wordsPerSection AND > 0, merge into previous section
  // So last section will have (wordsPerSection + remainder) words
  const sectionCount = remainder > 0 ? fullSections : fullSections;

  return words.map((word, idx) => {
    let sectionId;
    if (remainder > 0 && idx >= fullSections * wordsPerSection) {
      // Last merged group → belongs to last full section (0-indexed: fullSections - 1)
      sectionId = fullSections - 1;
    } else {
      sectionId = Math.floor(idx / wordsPerSection);
    }
    return {
      ...word,
      word_id: idx,          // 0-based row index (after header)
      section_id: sectionId, // 0-based section index
    };
  });
}

// ── Main Seed Function ─────────────────────────────────────────────────────
async function seed() {
  const csvPath = path.join(__dirname, 'A1 Wordlist.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌  A1 Wordlist.csv not found in project directory');
    process.exit(1);
  }

  console.log('📖  Parsing CSV...');
  const rawWords = parseCSV(csvPath);
  console.log(`   Found ${rawWords.length} words`);

  console.log('📐  Assigning sections (10 per section, merging last if < 10)...');
  const words = assignSections(rawWords, 10);

  // Log section summary
  const sectionMap = {};
  words.forEach(w => {
    sectionMap[w.section_id] = (sectionMap[w.section_id] || 0) + 1;
  });
  Object.entries(sectionMap).forEach(([s, count]) => {
    console.log(`   Section ${parseInt(s) + 1}: ${count} words`);
  });

  console.log('\n🔥  Writing to Firestore (batch upserts)...');
  const vocabCol = db.collection('vocabulary');

  // Firestore max batch size = 500
  const BATCH_SIZE = 400;
  let processed = 0;

  for (let start = 0; start < words.length; start += BATCH_SIZE) {
    const chunk = words.slice(start, start + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach(word => {
      const docRef = vocabCol.doc(String(word.word_id));
      batch.set(docRef, {
        word_id: word.word_id,
        de: word.de,
        en: word.en,
        section_id: word.section_id,
      }, { merge: true }); // merge: true preserves any extra fields, never touches user_progress
    });

    await batch.commit();
    processed += chunk.length;
    console.log(`   ✅  ${processed} / ${words.length} words written`);
  }

  console.log(`\n✨  Done! Seeded ${words.length} words into Firestore.`);
  console.log(`   Sections: ${Object.keys(sectionMap).length} (section IDs are 0-indexed)`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seeding failed:', err);
  process.exit(1);
});
