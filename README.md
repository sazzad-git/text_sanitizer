# Text Sanitizer Pro - Chrome Extension

A Chrome Extension (Manifest V3) that sanitizes text by replacing restricted words with safe alternatives.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the folder containing the extension files

## Usage

1. Click the extension icon in your Chrome toolbar
2. Paste your text into the "Input Text" textarea
3. Click the "Sanitize" button
4. The sanitized output will appear in the "Sanitized Output" textarea
5. Click "Copy to Clipboard" to copy the sanitized text

## Adding New Words

To add custom word mappings:

1. Click the "Settings" section header to expand it
2. In the "Add New Word" form:
   - Enter the original word (e.g., "payment")
   - Enter the replacement (e.g., "pa_yment")
3. Click "Add Word"
4. The word will be saved and used for future sanitizations

## Managing Words

- **View all words**: Expand the Settings section to see all restricted words and their replacements
- **Delete a word**: Click the "Delete" button next to any word in the list

## Default Words

The extension comes with these default word mappings:
- `payment` → `pa_yment`
- `email` → `ema_il`
- `whatsapp` → `wha_tsapp`
- `skype` → `sky_pe`

## Features

- Case-insensitive word matching
- Preserves original case in replacements
- Dark/light mode support (follows system preferences)
- Word mappings synced across devices via Chrome sync
- Clean, modern UI

## Generating Icons

The extension needs icon files (`icon16.png`, `icon48.png`, `icon128.png`). You have two options to generate them:

### Option 1: Using the HTML Generator (Recommended)
1. Open `generate-icons.html` in your web browser
2. Click each "Download" button to save the icons
3. Save all three PNG files in your extension folder

### Option 2: Using Python Script
1. Install Pillow: `pip install Pillow`
2. Run: `python generate_icons.py`
3. The icons will be generated automatically in your extension folder

The icons feature a modern shield design with a checkmark, matching the extension's security/sanitization theme with a purple gradient background.
