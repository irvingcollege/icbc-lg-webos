# icbc-lg-webos

Irving College Baptist Church for **LG webOS TV**. A separate adaptation of [irvingcollege/icbc-samsung-tv](https://github.com/irvingcollege/icbc-samsung-tv) at commit `3a203ec2abce042af2ee40d34ab85c189091c723`. The Samsung application and production streaming server were not modified.

The original gold/teal design, church artwork, service times, three-column sermon library, catalog normalization and streaming URLs are retained. `js/platform.js` now uses HTML5 video instead of Samsung AVPlay. Native HLS is preferred; the existing local HLS.js 1.6.13 bundle is available when native HLS is absent and Media Source Extensions are supported. No remote script CDN, backend, login or telemetry was added.

**Status:** a real `.ipk` was built with LG's official `@webos-tools/cli` 3.2.6, TV profile. Automated browser and adapter tests do not establish LG television compatibility. No LG TV or simulator was connected. The catalog response currently lacks a CORS header; see [verification and release gates](docs/verification.md) before release.

## Download

Get the [installable IPK and source ZIP](downloads/README.md), or visit [GitHub Releases](https://github.com/irvingcollege/icbc-lg-webos/releases). On a GitHub file page, use **Download raw file** to save the file to your computer. These are development builds; physical LG TV testing remains outstanding.

## Develop, test and package

Use Node.js 24 (CLI minimum: Node 20), npm, Python 3 for package verification, and Chromium:

```sh
npm ci
npm run check
npm test
npm run build
npm run package
npm run verify:ipk
npm start
```

Tests default to `/usr/bin/chromium`. Set `CHROMIUM_PATH` to your browser executable, or run `npx playwright install chromium` and set `PLAYWRIGHT_BUNDLED=1`. CI installs Playwright Chromium and runs the same checks. Browser tests intercept production URLs and return synthetic fixtures; they never change the church server.

`npm start` serves the development preview on port 8080. Production content still comes from the existing church endpoints and requires working CORS where enforced. The local server is for development only.

`npm run package` stages only `index.html`, `appinfo.json`, `css/`, `js/`, and `assets/` in `dist/`, then invokes the pinned official LG `ares-config --profile tv` and `ares-package --no-minify`. Disabling the CLI's additional JavaScript minification keeps deployed code identical to tested source and preserves the already bundled HLS.js file. It fails on CLI errors and inspects the result using `ares-package --info`. Output:

```text
artifacts/church.irvingcollege.icbc_1.0.0_all.ipk
```

`npm run verify:ipk` validates the ar/IPK container, control metadata, safe archive paths and every deployed application file against `dist/`. Build tooling, npm dependencies, tests and credentials are excluded. CLI packaging state is placed under ignored `work/cli-state/` using the CLI's supported `APPDATA` setting.

## Remote and lifecycle

- Magic Remote pointer: hover focuses a visible button, click selects; wheel scrolling remains native.
- D-pad: arrows use the original spatial navigation; OK/Enter activates the focused button.
- LG Back (`461`, browser Escape): leave playback and restore the originating button; leave the archive for home; at home show Stay/Exit confirmation. Back dismisses the confirmation. `disableBackHistoryAPI` lets the app handle LG Back itself.
- Play `415`, Pause `19`, Play/Pause `179` or named media events, Stop `413`, Rewind `412`, Fast Forward `417`. Stop returns home; archives seek 30 seconds; live seeking is disabled. Visible controls support remotes without media keys.
- Hidden documents pause playback. Returning requires Play. Closing playback releases the source, HLS instance, handlers and timers. Exit uses `window.close()` in the webOS runtime.
- A 20-second startup/stall watchdog provides Retry. Media errors and rejected play requests give recovery messages. Retry reopens the same URL; Refresh reloads the catalog and keeps existing sermons if the request fails.

A styled, focus-constrained exit dialog replaces native HTML `dialog`, which older TV engines may lack. Its backdrop blocks background pointer actions. The visual design remains the same.

## Content and branding

Livestream: `https://live.irvingcollege.church/hls/stream.m3u8`

Sermons: `https://live.irvingcollege.church/sermons/catalog.json`

The unmodified `js/catalog.js` accepts an array, `{ "sermons": [...] }`, or `{ "items": [...] }`. Media fields: `url`, `videoUrl`, `video_url`, `video`, `file`, `filename`, `src`. Relative media paths resolve under `https://live.irvingcollege.church/sermons/`. Only HTTPS MP4/HLS URLs on that host are accepted, including query strings. The library retains server order and inserts titles as text. No catalog snapshot or sample sermons are shipped as production content.

The existing cross artwork remains `assets/icon.png`. LG icons are resized copies: `assets/lg-icon.png` (80×80), `assets/lg-large-icon.png` (130×130). Gold/teal branding and Central Time service times are preserved. Bundled HLS.js retains its Apache-2.0 license at `assets/vendor/HLS-LICENSE.txt`.

The intended initial validation target is webOS TV 6.0 and later; this is a testing target, not a verified support claim. Application code is checked as ES5 and avoids requiring native `dialog`. Actual model/year support must be established on devices and selected in Seller Lounge accordingly.

See [installation and LG Content Store submission](docs/install-and-submit.md), [test results and physical TV checklist](docs/verification.md), and [source changes](docs/source-reference.md).
