# HEMA Scorecard Overlay

An OBS overlay from HEMA Scorecard.

## Using the Overlay

### Setup

* Install a browser extension that allows CORS requests. This is currently necessary to get around an issue in the HEMA Scorecard API.
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)
  * [Chrome](https://mybrowseraddon.com/access-control-allow-origin.html?v=0.2.1&type=install)

## Running Locally

*You can ignore this section if you are using the website instead of hosting locally.*

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
