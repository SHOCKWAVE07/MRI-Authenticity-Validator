# Blinded MRI Validation Tool

A specialized web application designed for expert validation of MRI image synthesis. This tool facilitates a double-blind study where experts evaluate the authenticity of synthetic MRI images against real ground truth data.

## Features

- **Blinded Evaluation**: Randomly presents Real vs. Synthetic image pairs to experts.
- **Modality Support**: Automatically detects and displays image modalities (T1, T2, PD) from filenames.
- **Admin Portal**: 
    -   Generates "Blinded Packages" from raw datasets.
    -   Creates `master_key.csv` for ground truth validation.
- **Expert Workflow**:
    -   **Warm-up Phase**: Known cases with immediate feedback to calibrate the expert.
    -   **Test Phase**: Fully blinded cases (Input vs. Target).
- **Data Export**: Generates CSV results containing user choices, response times, and confidence levels.
- **Privacy First**: Runs entirely in the browser. No data is uploaded to any external server during the session.

## Technology Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Premium Dark Theme)
- **Data Handling**: Client-side parsing of Folder/ZIP structures.

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd blinded-mri-validator
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally
To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Deployment

This is a static Single Page Application (SPA) and is optimized for deployment on platforms like Netlify or Vercel.

### Deploying to Netlify (Recommended)

1.  **Build the Project:**
    ```bash
    npm run build
    ```
    This generates a `dist` folder.
2.  **Upload:**
    -   Go to [Netlify Drop](https://app.netlify.com/drop).
    -   Drag and drop the `dist` folder.
    -   Your site is now live!

*Note: A `netlify.toml` file is included to handle client-side routing.*

## User Guide

### For Administrators
1.  Ideally, run the app locally or access via the hidden "Admin Access" button on the landing page.
2.  Select **Generation Mode** to create a package for experts.
3.  Upload your raw dataset (folders containing triplets: `input`, `real`, `synth`).
4.  The tool will generate a zip file containing:
    -   `warmup/` folder
    -   `test/` folder
    -   `master_key.csv` (Keep this safe!)

### For Experts
1.  Open the deployed application.
2.  Click **"Load Image Folder"** and select the folder provided by the administrator (unzipped).
3.  Enter your Name/ID to start.
4.  **Warm-up**: Evaluate cases with immediate feedback.
5.  **Test**: Evaluate blinded cases.
6.  **Finish**: Download your results as a CSV file and send it back to the administrator.

## File Naming Convention
To ensure the app correctly detects image types and modalities, use the following conventions in your filenames:
-   **Type**: `input`, `real`, `synth` (or `fake`)
-   **Modality**: Append as the last part after an underscore (e.g., `_T1.png`, `_PD.jpg`)
    -   Example: `case123_input_T1.png` -> Displays as **T1**
