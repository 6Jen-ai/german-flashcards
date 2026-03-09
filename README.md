# German-English Flashcard SPA

A minimal, zero-backend Single Page Application (SPA) for learning German vocabulary using flashcards. Built with Vanilla JavaScript and Tailwind CSS.

## Features
- **Zero-Backend Architecture**: Everything runs in a single `index.html` file. You can deploy it instantly on GitHub Pages or simply open it locally.
- **Audio Pronunciation**: Uses your browser's built-in Web Speech API to pronounce text automatically (`de-DE` for German, `en-US` for English).
- **Progress Tracking**: Tracks your completed sections using your browser's `localStorage` so you don't lose where you left off.
- **Dynamic Chunking**: Slice your vocabulary into smaller, manageable sections (e.g., 10 words at a time).

## Setup & Usage

### Running the App
Since it's a completely static single-file app, you don't need a server or a build process:
1. Double-click `index.html` to open it in any modern web browser.
2. Tap the flashcard or press the `Space` bar to flip it. Use the arrow buttons or keys to navigate.

### Customizing Your Vocabulary List (Google Sheets)
By default, the app loads a built-in sample dataset of German numbers and greetings. You can easily plug in your own Google Sheet:

1. **Create your Google Sheet** with two columns:
   - **Column A**: German Words
   - **Column B**: English Translations
   *(Include a header row at the top, such as "German" | "English")*
2. **Publish the Sheet**:
   - Go to **File > Share > Publish to web**.
   - Select **Comma-separated values (.csv)** from the format dropdown.
   - Click **Publish** and copy the generated URL.
3. **Connect the App**:
   - Open the Flashcard SPA.
   - Click the **Settings** (gear icon) in the top right.
   - Paste the copied CSV URL into the **CSV Data URL** field.
   - Optionally adjust the **Words per Section** (default is 10).
   - Click **Apply & Reload** and start studying!

## Hosting on GitHub Pages
Since this app is a single `index.html` file, it is perfectly suited for free hosting on GitHub Pages. Here is how you can publish it:

1. **Create a GitHub Account**: If you don't have one, sign up at [github.com](https://github.com).
2. **Create a New Repository**: 
   - Click the **+** icon in the top right corner and select **New repository**.
   - Name your repository (e.g., `german-flashcards`).
   - Leave it as "Public" and click **Create repository**.
3. **Upload Your File**:
   - On your new repository page, click the "uploading an existing file" link.
   - Drag and drop your `index.html` file into the upload area.
   - Click **Commit changes** to save the file to your repository.
4. **Enable GitHub Pages**:
   - Go to the **Settings** tab of your repository.
   - In the left sidebar, click on **Pages**.
   - Under the **Build and deployment** section, look for **Source**. In the dropdown under "Branch", select `main` (or `master`) and click **Save**.
5. **Get Your URL**:
   - After a minute or two, refresh the Pages settings page. You will see a message at the top saying: "Your site is live at `https://[your-username].github.io/[repo-name]/`".
   - You can now share this URL with anyone!
