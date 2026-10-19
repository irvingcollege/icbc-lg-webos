# Source reference and isolation

Reference: https://github.com/irvingcollege/icbc-samsung-tv

Inspected local and remote default-branch revision: `3a203ec2abce042af2ee40d34ab85c189091c723`.

Read the source README, `js/platform.js`, application UI/navigation, catalog parser, CSS, tests and development scripts before porting. The Samsung checkout remains separate at `/workspace/icbc-samsung-tv`; no Samsung files or GitHub repository content were changed. Tracked-file SHA-256 hashes and clean Git status were compared before and after the work.

| Area | webOS adaptation |
| --- | --- |
| `js/catalog.js` | Copied unchanged; URL restrictions, schema aliases, text rendering and ordering retained |
| `assets/icon.png`, bundled HLS.js and license | Copied unchanged |
| `index.html` | Same church copy/layout and control labels; Samsung loader/object removed; HTML video retained; exit dialog replaced by a styled element/backdrop; CSP disables objects |
| `css/app.css` | Original styling retained; removed AVPlay selector; added letterboxing and exit-dialog positioning/backdrop |
| `js/app.js` | Original catalog/UI logic reused; LG keys, pointer focus, modal focus handling, and archive Back behavior added |
| `js/platform.js` | HTML5 video/native HLS adapter with bundled HLS fallback, asynchronous state protection, timeouts, cleanup and webOS exit |
| `appinfo.json` and LG icons | New LG metadata and resized original cross artwork |
| Tooling/tests | Reused catalog and browser tests/fixtures; replaced Samsung adapter/distribution tests with webOS tests; new official CLI build/verification scripts and CI |

Samsung SDK configuration, signing scripts, Tizen manifests, certificates, seller assets and Samsung-only workflows are intentionally not part of this separate project. No production server configuration was edited.
