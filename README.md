# HEMA Scorecard Overlay

An OBS overlay to display a match from HEMA Scorecard.

**[Try the Overlay!](https://hema-scorecard-overlay.netlify.app/)**

This README is mainly intended for other developers. If you are trying to use this overlay for your own tournaments, see this handy **[User Guide](https://docs.google.com/document/d/14IaRjUM7ZUk7ZOIJMvq5dZYVBv4XlvjxFYPViMNNHyA)**.

## Architecture

This creates a static multi-page website with three pages:

* **Navigation**: The main page which can be used to navigate to the sub-pages.
* **Overlay**: The overlay which can be used as a **browser source** in OBS.
* **Controller**: Used to configure the overlay. Run as a **custom dock** in OBS.

The controller and overlay communicate via `localStorage` which is shared between browser sources and custom docks. The user
provides the match URL and other configuration data. The overlay uses
HEMA Scorecard APIs to retrieve data about the match using the match ID from the provided URL.

All logic is written in TypeScript using vanilla JS DOM manipulation (no jQuery, React, etc.). It is compiled into JavaScript and deployed alongside plain HTML and CSS files as a static site, which means it does not need to link to any database, etc. Only two external libraries are used:

* `zod` for JSON data parsing.
* `fitty` for automatic text scaling.

## Running the Overlay in the Browser

Since the overlay is just a website, it can be run in the browser to see how it looks. However, there are some additional steps needed to make the API calls properly.

### Setup

Install a browser extension that allows CORS requests. This is currently necessary to get around an issue in the HEMA Scorecard API.

* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)
* [Chrome](https://mybrowseraddon.com/access-control-allow-origin.html?v=0.2.1&type=install)

Note this extension only applies to the browser you are using; OBS uses their own custom browser which requires its own workarounds (see the [User Guide](https://docs.google.com/document/d/14IaRjUM7ZUk7ZOIJMvq5dZYVBv4XlvjxFYPViMNNHyA)).

## Running Locally

*You can ignore this section if you are using the website instead of hosting locally.*

If you want to make and test changes locally, you must run the site yourself locally instead of using the published one.

### Setup for Local Development

Requires:

* [Node.js](https://nodejs.org/en/download)
  * Downloading through the Windows Installer (.msi) is easiest

```bash
npm install
npm run build
```

Grant esbuild.exe runtime permissions, if prompted.

### Running the Tool

```bash
npm start
```

Then open `localhost:3000` and follow instructions like above. Note that if you use `localhost` directly, it will expect you to use something like [this local CORS server](https://www.npmjs.com/package/local-cors-proxy) to get around the CORS issues. If you do not want to set that up, use a different domain like `http://127.0.0.1:3000`.

After building once, `npm start` should automatically update the site with any changes (hot reload).
