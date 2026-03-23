# 🇩🇪 Flashcard WebAPP by Jen

A mobile-first German A1 vocabulary flashcard PWA powered by **Firebase Firestore**.  
*Optimized for Phones* — works great on iPhone with OLED dark mode.

---

## How to Use the App

1. **Open** `index.html` in your browser (or serve via `npx serve .`).
2. **Enter passcode** `6666` to unlock Admin Mode.
3. **Home screen** shows all sections with live `X/10 Learned` progress chips.
4. **Tap a section card** to start a study session (cards are shuffled randomly).
5. **Tap the card** to flip and reveal the English translation.
6. **Press ✔** (green) if you know the word — saves `status: 1` to Firestore immediately.
7. **Press ✕** (red) if you missed it — saves `status: 0`.
8. After all cards: **Summary screen** shows Correct / Missed for this session only.
9. **Restart Unlearned** — starts a new randomized session with only your missed words.
10. **Review All Unlearned** — study every word you haven't marked learned yet.
11. **Review All Progress** — review every single word in the list.

> After **5 minutes of inactivity**, the passcode screen re-appears automatically.  
> Press **⌂** (home icon) anytime to exit a session — a confirmation prompt will appear.

---

## Sectioning Logic

Words are grouped into **sections of 10**.  
If the final batch has **fewer than 10 words**, it is **merged** into the previous section  
(so the last section may have up to 19 words rather than creating a tiny group).

---

## How to Update the Wordlist

### Step 1 — Edit the CSV

Open `A1 Wordlist.csv` in Excel or any text editor.

- **Add new rows** at the bottom (German in column A, English in column B).
- **Modify existing rows** by changing the text in-place.
- **Do NOT delete rows** — row order determines `word_id`. Deleting rows shifts all IDs below
  and will orphan existing `user_progress` records.
- **Do NOT change the header row** (`German,English`).

### Step 2 — Set Up Firebase Admin (first time only)

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Project: flashcard-de**.
2. Navigate to **Project Settings → Service Accounts → Generate new private key**.
3. Save the downloaded JSON as **`serviceAccountKey.json`** in this project folder.
4. Install the admin SDK (one-time):
   ```bash
   npm install firebase-admin
   ```

### Step 3 — Run the Seeder

```bash
node seed.js
```

The script will:
- Read `A1 Wordlist.csv`
- Upsert only changed/new words into `vocabulary` collection (using `merge: true`)
- **Never touch** any `user_progress` records — existing progress is always preserved
- Print a summary of sections and word counts

### Firestore Security Rules (required)

In Firebase Console → **Firestore → Rules**, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ This allows public access. Suitable for personal/private use behind the passcode.
> For production, restrict to authenticated users.

---

## Project Structure

```
german-flashcards/
├── index.html          # Main PWA (single file app)
├── seed.js             # Node.js Firestore seeding script
├── A1 Wordlist.csv     # Vocabulary source data
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline cache)
├── serviceAccountKey.json  # ← YOU ADD THIS (not committed to git)
└── README.md           # This file
```

---

## Firebase Collections

| Collection      | Document ID | Fields                                     |
| --------------- | ----------- | ------------------------------------------ |
| `vocabulary`    | `{word_id}` | `word_id`, `de`, `en`, `section_id`        |
| `user_progress` | `{word_id}` | `word_id`, `status` (0 = missed, 1 = learned) |
