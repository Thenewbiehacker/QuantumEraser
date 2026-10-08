<!-- Project notes for running and publishing the Quantum Eraser exhibit page. -->
# Quantum Eraser exhibit

A small static exhibit page built with semantic HTML, CSS, and plain JavaScript. Chart.js is loaded from cdnjs and the page uses Google Fonts; there is no build step.

## Run locally

Open `index.html` directly in a browser. For a local static server, run one of these from the project folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. The direct-file option and the static server both require an internet connection for Chart.js and Google Fonts.

## Deploy to GitHub Pages

1. Commit `index.html`, `style.css`, `app.js`, `README.md`, and the `assets/` folder to the repository.
2. Push the commit to GitHub.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the branch and `/ (root)` folder, then save.
5. Open the Pages URL shown in Settings → Pages after deployment completes.

There is no build command. Keep the files at the selected publishing root so the `index.html` entry point and relative asset paths resolve.
