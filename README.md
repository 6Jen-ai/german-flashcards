# German-English Flashcard PWA

A high-performance, Progressive Web App (PWA) for learning German vocabulary using a flashcard mechanics. Built with Vanilla JavaScript and Tailwind CSS.

## Features
- **PWA Ready**: Installable to the mobile home screen. Includes a manifest and Service Worker.
- **Dual-Mode System**:
  - **Demo Mode**: Public mode with an internal 10-word dataset. Progress saves locally to your browser.
  - **Admin Mode**: Private mode accessed using a passcode (`6666`) designed to sync using a Google Apps Script cloud backend (sync logic placeholder included).
- **Learning Loop**: Flashcards are explicitly rated `✔️ Learned` or `❌ Unlearned`. Unlearned words will repeat endlessly at the end of a section until mastered. 
- **Audio Pronunciation**: Uses your browser's built-in Web Speech API to pronounce text automatically (`de-DE` for German, `en-US` for English).
- **Mobile-Optimized UX**: Safe-guards against double-tap zoom styling and native Safari layout quirks.

## Setup & Usage

### Running Locally
To test features like the Service Worker, which require a secure context or `localhost`:
1. Start a local Python server:
   ```bash
   python -m http.server 8000
   ```
2. Navigate to `http://localhost:8000`

### Connecting Google Apps Script (Admin Mode)
By default, Admin Mode simulates the cloud sync. To connect your actual Google Sheet:

1. **Deploy your Google Apps Script** to handle `GET` (fetch words/progress) and `POST` (update status) requests.
2. In `index.html`, locate this line (around line 249):
   ```javascript
   const App = {
       mode: 'none',
       GAS_PWA_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE', 
   ```
3. Replace the placeholder URL with your generated Apps Script Web App URL.

## Hosting on GitHub Pages
This app is essentially a set of static files (`index.html`, `manifest.json`, `sw.js`), perfectly suited for free hosting.

1. Create a GitHub Account and upload the files to a new repository.
2. Under the repository **Settings > Pages**, enable GitHub Pages by selecting the `main` branch.
3. Your site will be live at `https://[your-username].github.io/[repo-name]/`!
