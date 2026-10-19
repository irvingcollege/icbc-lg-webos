# Reviewer instructions — version 1.0.1

App ID: `church.irvingcollege.icbc`  
Full name: Irving College Baptist Church  
Launcher name: Irving College BC  
Support: icbcnextsteps@gmail.com  
Requested distribution: United States only  
Language: English

## Prerequisites

Internet access is required. No login, credentials, payment, subscription, or external activation is required. No test account is needed. The app requests only its catalog and media from `https://live.irvingcollege.church` and uses locally packaged scripts and artwork. It does not request Luna service permissions (`requiredACG: []`).

## Test route

1. Launch **Irving College BC**. The home shows the church name, welcome text, Watch Live, Browse Sermons, service times, Latest Sermons, Refresh, and Privacy & Support.
2. Use arrows and OK to choose **Browse Sermons**, or use the Magic Remote pointer. The first available sermon receives focus. Select a sermon.
3. The player displays its title, connecting status, and playback controls. Test Pause/Play and ±30-second seeking. Stop or Back returns home and restores the sermon button's focus.
4. Choose **Watch Live** during a confirmed broadcast. Live seeking controls are disabled. Outside broadcast windows the stream may be unavailable; use the archive route for an on-demand test. A returned playlist alone does not establish that a broadcast is active.
5. If a stream is unavailable or the connection stalls, a recovery message appears. **Retry** reopens the same URL. **Refresh** reloads the archive; existing sermons remain visible if refreshing fails.
6. Open **Privacy & Support** in the home footer. Read the privacy notice and support email. Use Back to Home or the remote Back key to return.
7. On home, Back shows a Stay/Exit App dialog in this candidate. Stay dismisses it; Exit App requests application closure. Validate this against the selected model groups and LG's current Back requirements before submission (see readiness checklist).

## Controls

Arrows: move focus. OK: activate. Pointer: move to focus, click to activate, wheel to scroll. Back: return within the app. Play/Pause/Stop and seek keys are supported where present; visible player controls provide an alternative. Leaving the app pauses active playback; returning requires Play. Media resources are released when playback is closed.

## Content URLs

- Catalog: https://live.irvingcollege.church/sermons/catalog.json
- Live HLS: https://live.irvingcollege.church/hls/stream.m3u8
- Recorded sermons: URLs returned by the catalog under the same church host.

No sample or synthetic video fixture is packaged in the production IPK. The church confirms rights to distribute its sermons and states music is excluded for rights reasons.

## Broadcast availability

The church confirms that only Sunday worship is livestreamed, starting at **10:30 AM U.S. Central Time (America/Chicago)**. The end time varies with the service. Other meetings shown in the app schedule are not livestreamed. Use local Central Time, including the seasonal CST/CDT change, rather than assuming a fixed UTC offset. Archives are the preferred reviewer route outside this window. Contact icbcnextsteps@gmail.com if a live review appointment is needed.

## Known open findings to resolve before submission

- Physical LG TV playback, shell exit, network recovery, remote controls and lifecycle have not been verified.
- A read-only catalog request on October 19, 2026 returned valid JSON but no Access-Control-Allow-Origin header, including with Origin: null. Validate installed-TV catalog loading and arrange an authorized server-owner CORS fix if needed; no server configuration has been changed here.
- LG's current self-checklist calls for entry-page Back to display the Home screen on webOS23–25; its general Back guide describes exit confirmation on 6.0+. Resolve interpretation with Seller Lounge or verify a compliant implementation for selected targets. Do not mark that row passed based on this document.
- Current browser screenshots use an explicitly documented production catalog snapshot, not a physical TV capture. The user reports successful visual launch on a Mac webOS26 simulator; real broadcast playback was not confirmed.
