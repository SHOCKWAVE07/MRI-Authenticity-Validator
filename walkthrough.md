# MRI Authenticity Validator - Walkthrough

## Overview
This application is a blinded validation tool for MRI experts to distinguish between Real and Synthetic images. It features a dual-pane viewer with synchronized focus, a two-phase workflow (Warm-up -> Blinded Test), and CSV data export.

## Features Implemented
- **Dual-Pane Viewer**: Synchronized Pan and Zoom (1:1 pixel validation).
- **Blinded Randomization**: 60/40 ratio (Synthetic/Real) logic.
- **Session Management**: 
  - **Warm-up**: Immediate feedback on correctness.
  - **Test**: No feedback, blinded data collection.
- **Folder Import**: Dynamically load local datasets via browser directory picker.
- **Data Export**: Generates CSV with reaction times and choices.

## How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
3. **Open Browser**: Go to `http://localhost:5173` (or port shown).

## Usage Guide
### Loading Data
When the app starts, you will see a Landing Screen.
- **Load Demo Data**: Uses the built-in placeholder set for testing.
- **Load Local Folder**: Select a folder containing your dataset.
  
**Expected Folder Structure**:
The app looks for sub-folders named `warmup` and `test`. Within those, it looks for triplets of images.
```text
MyDataset/
  ├── warmup/
  │   ├── Case1/
  │   │   ├── input.png
  │   │   ├── real.png
  │   │   └── synthetic.png
  │   └── Case2/ ...
  └── test/
      ├── CaseA/ ...
      └── CaseB/ ...
```
*Note: Filenames should contain "input"/"source", "real", and "synthetic"/"gen" to be recognized.*

### Session Flow
1. **Warm-up**: 
   - Observe the Left Input.
   - Judge if the Right Target is Real or Synthetic.
   - Click Submit.
   - **Feedback**: A pop-up tells you if you were right.
2. **Transition**: Automatically moves to Test phase after warm-up cases are done.
3. **Test Phase**:
   - No feedback.
   - Progress bar updates.
4. **Completion**:
   - "Session Complete" screen.
   - Click **Download Results** to get the CSV.

## Verification Steps
- **Sync Toggle**: Enable "Sync Pan/Zoom" in the viewer. Zoom into the left image; the right image should match exactly.
- **Randomization**: Check [src/config.js](file:///d:/Desktop/Blinded%20Test%20App/src/config.js) to adjust probabilities (default 0.6 Synthetic).
- **CSV Output**: Verify `ResponseTime_ms` and `TargetShown` columns in the exported file.

## Deployment & Distribution
**How to give this tool to experts?**

### Option A: Hybrid (Recommended for Large MRI Sets)
1. **Host the App**: fast and free on services like **Netlify** or **Vercel**.
   - Drag and drop the `dist` folder (created after `npm run build`) to Netlify Drop.
   - You get a public link (e.g., `https://mri-validator.netlify.app`).
2. **Distribute Data**:
   - Zip your `warmup` and `test` image folders.
   - Send the Zip file to your experts (Email, Drive, Dropbox).
3. **Workflow**:
   - Expert opens your App URL.
   - Expert unzips the images on their laptop.
   - Expert clicks **"Load Local Folder"** in the app and selects their folder.
   
   *Pros: Zero storage costs, faster loading for huge files, data privacy.*

### Option B: Fully Bundled (Small Sets Only)
1. Place all images inside the `public/` directory of this project.
2. Create a `manifest.json` file pointing to them (relative paths).
3. Edit `src/App.jsx` to load this new manifest by default instead of the Demo one.
4. Deploy the app. Experts access everything via just the link.
   
   *Pros: Easiest for experts. Cons: App becomes large/slow if you have GBs of images.*
