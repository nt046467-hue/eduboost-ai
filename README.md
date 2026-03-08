<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1JrBcFPYr0wttxQKW6q3cfv3KEDpcbLQN

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

**Additional steps for full functionality:**

- install the PDF library used by the PDF summarizer:
  ```bash
  npm install pdfjs-dist
  ```
  without it the component will only show a placeholder message.
- when deploying to Netlify the serverless functions are written in TypeScript; you must compile them before deploy. Running `npm run build` will run the `build:functions` script automatically (it uses `tsc -p tsconfig.functions.json`).

3. Run the app:
   `npm run dev`
