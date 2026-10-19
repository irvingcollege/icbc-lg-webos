# Verification and remaining release gates

**Date:** October 19, 2026. **Physical LG TV compatibility has not been verified.** No physical TV, LG simulator, Seller Lounge account or store submission was used.

## Completed checks

| Check | Result |
| --- | --- |
| Reference source | Inspected README, platform adapter, UI, CSS, catalog, tests and tooling at `3a203ec2abce042af2ee40d34ab85c189091c723` |
| Samsung isolation | All 44 tracked files match their pre-work SHA-256 hashes; clean Git status; remote repository unchanged |
| `npm run check` | Passed: metadata, icon dimensions, version consistency, ES5 application scripts, removal of Samsung runtime, CSP, pinned HLS bundle |
| `npm test` | **29 passed, 0 failed, 0 skipped** |
| `npm run build` | Passed: production allowlist staged in `dist/` |
| `npm run package` | Passed with official `@webos-tools/cli` **3.2.6**, `tv` profile, `--no-minify`; CLI package inspection succeeded without metadata warnings |
| `npm run verify:ipk` | Passed: real ar/IPK structure, package/version metadata, safe paths, all **11 deployed app files** match `dist/` byte-for-byte |
| Visual comparison | Matching 1920×1080 browser home captures using the same catalog; copy, layout, artwork and colors retained; only one focus-ring rasterization pixel differed |
| Production catalog read | HTTPS GET 200, `application/json`, array with 2 records; unchanged catalog normalizer accepts both |
| Production MP4 headers | Read-only HEAD 200, `video/mp4`, `Accept-Ranges: bytes`; full MP4 and actual range playback were not fetched/tested |
| Production live manifest | Read-only GET 200, `application/x-mpegURL`, `Access-Control-Allow-Origin: *`; H.264/AAC variant advertised; variant/segment playback was not tested |

Runtime: Node 24.19.0, npm 11.9.0, Chromium 154.0.8037.57 on Debian 13; Python 3 for IPK verification. The official npm registry reported 3.2.6 as the current LG CLI version when installed. The pinned package includes LG's schema and command help. LG's developer website was denied by this environment's network policy; the official GitHub CLI repository and npm registry were available.

### Automated coverage

- **12 browser tests:** spatial navigation, focus restore, safe sermon rendering, empty/malformed/failed catalogs and Refresh, archive retention after failure, exit confirmation, real synthetic MP4 playback, Play/Pause, live errors/disabled seeking, real local HLS fixture playback through bundled HLS.js, three-column/full-screen layout, LG key codes, Magic Remote pointer focus, Stop, lifecycle pause, Retry to successful playback, modal Tab trapping and background-click blocking.
- **3 catalog tests:** array/wrapper formats, aliases, relative/signed media URLs, host/protocol restrictions, invalid-record filtering and empty catalogs.
- **2 distribution tests:** webOS metadata, production staging allowlist and original streaming endpoints.
- **12 adapter tests:** native HLS preference with an HTML video mock, pause/resume/seek/cleanup, legacy void-returning `play()`, pause during HLS loading, stale Promise/events, rejected playback and Retry, bounded startup/stall recovery, fatal/missing HLS fallback, infinite-duration seeking, time/ended events, LG exit, Pause during native startup and queued-pause/resume races.

Native LG video behavior and native application exit are mocked in adapter tests. Chromium tests play actual synthetic MP4/HLS media, not production church videos. Tests intercept production URL requests; no test changes server content or configuration. Raw successful logs are in [evidence/](evidence/).

## Release gates

1. **Catalog CORS:** production catalog GET responses, including a request with `Origin: null`, did not include `Access-Control-Allow-Origin`. Browser cross-origin XMLHttpRequest generally requires it; LG packaged-app behavior must be checked on the target TV. This is a release risk for loading the live sermon library even though its JSON schema is correct. Ask the church's server owner to validate/configure appropriate catalog CORS if device/browser testing confirms it is required. No server changes were made, and this app does not disable browser security or add an external proxy. Confirm CORS for HLS variants, segments and keys as well. A successful curl request does not prove browser access.
2. **Physical-device matrix:** complete the checklist below for intended LG model groups. webOS TV 6.0+ is the initial testing target, not a certified minimum. Browser ES5 checks and the removal of native `dialog` improve compatibility but do not prove older engines or hardware decoders.
3. **Store readiness:** confirm the permanent ID, support contact, accurate privacy policy, content rights, ratings, listing artwork/screenshots, target regions and current LG submission requirements. The CLI IPK is built; certification and publication are outstanding.

## Physical LG TV checklist

Record tester/date, TV model/year, firmware, webOS version, network type, package SHA-256 and pass/fail notes. Begin with the exact delivered IPK and repeat for every model group intended for distribution.

- [ ] Developer Mode pairing, IPK installation, launch, relaunch and version update succeed.
- [ ] Home matches the reference at FHD and on a 4K panel: colors, original cross, text, schedule, focus ring, safe edges and 16:9 layout.
- [ ] D-pad arrows and OK reach every home/library/player/dialog control; long catalogs scroll and long titles wrap; Back restores focus and returns archive → home → exit confirmation.
- [ ] Magic Remote movement, click, wheel, switching to D-pad and switching back preserve usable focus; stationary cursor does not steal focus after Back/dialog close.
- [ ] Actual Play, Pause, Play/Pause where present, Stop, Rewind/Fast Forward and visible controls behave correctly; system volume/Home controls retain normal system behavior.
- [ ] Real catalog loads from the installed app with TV TLS/CORS rules; Refresh handles slow requests, HTTP errors, malformed JSON and offline/network recovery without losing existing entries.
- [ ] Native HTML5 HLS starts during an actual church broadcast with sound and correct aspect ratio; observe the full service, not just the first frame. Check variants/segments, codec support, A/V sync and any redirects/keys.
- [ ] Offline/ended livestream produces a recoverable status; Retry reconnects when broadcast/network returns. No automatic live seeking occurs.
- [ ] Real archived MP4 plays with sound; pause/resume, ±30-second seeking and byte ranges work; end-of-sermon, replay and repeated open/close do not leak resources.
- [ ] Disconnect/reconnect networking during startup and after playback begins; startup/stall watchdog reaches Retry, and successful retry clears errors. Test unavailable and unsupported media.
- [ ] Home/app switching, screensaver, suspend/resume and TV standby do not leave background audio; returning requires Play. Test the TV's actual visibility/lifecycle events.
- [ ] Back from each screen, Stay, Exit App and relaunch behave correctly in the actual webOS shell. Browser fallback and mocked `window.close()` are insufficient proof.
- [ ] Inspect logs for security/CORS/TLS/media errors, verify a long playback session, and record any model-specific limitations before selecting store targets.

No items on this physical checklist are marked complete by the automated tests.

## Delivered package

File: `church.irvingcollege.icbc_1.0.0_all.ipk`

Application ID: `church.irvingcollege.icbc`; version: `1.0.0`; architecture: `all`.

SHA-256:

```text
1bb094fa538d2c9cf6a6f37ee173fc721a53ce565566897df6929364d562df18
```

A real development IPK is provided. It is not an LG-certified or store-published release. Installation and submission steps are in [install-and-submit.md](install-and-submit.md).
