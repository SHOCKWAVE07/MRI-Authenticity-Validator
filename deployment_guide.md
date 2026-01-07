# Deployment Guide: Blinded MRI Validation Tool

This app is a static React application (Single Page Application). It can be easily deployed to Netlify.

## Option 1: Netlify Drop (Simplest)
**Best for:** Quick testing without connecting to Git.

1.  **Build the Project:**
    Open your terminal in the project folder and run:
    ```bash
    npm run build
    ```
    This creates a `dist` folder in your project directory.

2.  **Upload:**
    -   Go to [app.netlify.com/drop](https://app.netlify.com/drop).
    -   Drag and drop the **`dist` folder** (created in step 1) onto the page.
    -   Netlify will deploy it instantly and give you a live URL.

## Option 2: Connect to Git (Recommended)
**Best for:** Continuous deployment (auto-updates when you push code).

1.  **Push to GitHub/GitLab:**
    Ensure your code is pushed to a repository.

2.  **New Site on Netlify:**
    -   Log in to Netlify.
    -   Click **"Add new site"** -> **"Import from existing project"**.
    -   Select your Git provider and repository.

3.  **Configure Build Settings:**
    Netlify should auto-detect these, but verify:
    -   **Build command:** `npm run build`
    -   **Publish directory:** `dist`

4.  **Deploy:**
    Click "Deploy site".

## Important Notes
-   **Routing:** A `netlify.toml` file has been added to the project root. This ensures that if users refresh the page, they are redirected correctly to the app entry point (essential for SPAs).
-   **Security:** Since the app logic requires the "Expert Package" (Zip) to be loaded manually by the user, there are no server-side secrets or databases to configure. The app runs entire in the user's browser.
