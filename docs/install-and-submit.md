# LG TV installation and Content Store submission

## Install with Developer Mode

Use a development computer and LG webOS TV on the same trusted local network. No Samsung certificates or changes to the streaming server are needed to sideload this app.

1. On the TV, install **Developer Mode** from LG's app store. Sign in with an LG developer account, enable **Dev Mode Status**, and follow the requested restart. Reopen Developer Mode and enable **Key Server**. Note the TV's IP address and displayed passphrase. The UI and session limit vary by model; keep the developer session active and renew it before expiry. Expiry or disabling Developer Mode may remove sideloaded apps.
2. On the computer install the official unified webOS CLI. The version used for this build is pinned below. The former `@webosose/ares-cli` package is deprecated; avoid conflicting global installations.

   ```sh
   npm install -g @webos-tools/cli@3.2.6
   ares-config --profile tv
   ares-setup-device --add icbc-lg --info "host=192.168.1.50" --info "port=9922" --info "username=prisoner"
   ares-novacom --device icbc-lg --getkey
   ```

   Replace `192.168.1.50` with the TV's address. Enter the Developer Mode passphrase when prompted by `--getkey`. If the device name already exists, use `--modify` instead of `--add`. Keep the downloaded SSH key and passphrase outside the project and source control.

3. From the unzipped project, build or use the supplied IPK:

   ```sh
   npm ci
   npm run check
   npm test
   npm run package
   npm run verify:ipk
   ares-install --device icbc-lg artifacts/church.irvingcollege.icbc_1.0.1_all.ipk
   ares-launch --device icbc-lg church.irvingcollege.icbc
   ares-inspect --device icbc-lg --app church.irvingcollege.icbc
   ```

   If using the standalone downloaded IPK, pass its actual path to `ares-install`; rebuilding is unnecessary. Web Inspector requires a compatible desktop browser. Allow local network communication; guest Wi-Fi isolation may prevent pairing.

4. Run every item in [the physical TV checklist](verification.md#physical-lg-tv-checklist). Record the model, firmware and webOS version. Check console/network logs, native HLS, actual broadcast playback and long playback sessions.
5. To close or uninstall the development application:

   ```sh
   ares-launch --device icbc-lg --close church.irvingcollege.icbc
   ares-install --device icbc-lg --remove church.irvingcollege.icbc
   ```

The generated IPK is an actual CLI package for development installation. Building it does not grant LG store approval or confirm TV installation. No TV install was performed here.

## LG simulator

Install a current LG webOS TV Simulator from LG's developer website on a supported desktop, then use the simulator's documented launch flow or `ares-launch --simulator <VERSION> <APP_DIRECTORY>` (and `--simulator-path <PATH>` when needed). Point it at this project's `dist/` directory. No simulator was installed or run in this cloud environment. The church representative subsequently reported successful visual launch of version 1.0.0 in the Mac webOS26 simulator; version 1.0.1 needs to be rechecked. Simulator video/remote behavior is supplementary evidence and cannot replace hardware tests.

## Submit to LG Content Store

1. Register the church's authorized seller account at [LG Seller Lounge](https://seller.lgappstv.com/). Complete seller verification and agreements. Read the portal's current webOS TV application submission and UX requirements; field names and asset requirements can change.
2. Create the application listing. Confirm that `church.irvingcollege.icbc` is the intended permanent application ID and available for the listing before first submission. Set target countries, language, supported model groups and content/age category. Only select model groups actually tested. If an identifier change is necessary before the first release, update `appinfo.json`, package checks, documentation and installation commands together.
3. Resolve all [release gates](verification.md), especially production catalog CORS and physical-device validation. Test the exact package to be uploaded. Keep the ID stable after release and increment the three-part version in both `appinfo.json` and `package.json` for updates. Rebuild with LG's official CLI and verify the IPK. `requiredACG: []` declares no Luna API permissions; do not add unrelated service privileges.
4. Prepare the current required listing assets: store icons/artwork in the portal's sizes, genuine app screenshots, description, support contact/URL, privacy policy, content rights declarations, region availability and rating answers. The included 80/130-pixel icons are application icons, not a complete store marketing asset set. Browser previews in this project are labeled development evidence; supply the screenshots the portal requires after device validation.
5. Describe the real data flow in the privacy policy. The app adds no account, analytics or persistent user data, but the church's streaming servers receive network requests and may log IP addresses; the church must disclose its actual hosting/logging practices. Confirm rights to distribute sermon video, music and any other content.
6. Upload the tested `.ipk` in Seller Lounge and complete the current package eligibility and certification checks. Follow LG's current signing/distribution process in the portal; this project does not supply LG store credentials, certification or a published listing. This is a webOS TV package, not a Tizen WGT or an LG mobile package.
7. Provide reviewer instructions: launch → Watch Live or Browse Sermons → select an archive; explain Back, Retry and Refresh. Give actual live service windows in Central Time and an archive that reviewers can play outside those windows. Include known network/codec requirements and required test information. Respond to certification findings, retest, then request publication through the authorized church account.

No app was submitted or published. Store registration, policy text, final listing assets, physical validation and LG's approval remain church/release-owner steps.

## References

- [Official unified CLI repository and current profile guidance](https://github.com/webos-tools/cli)
- [Official LG CLI introduction](https://webostv.developer.lge.com/develop/tools/cli-introduction)
- [Official Developer Mode guide](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app)
- [Official appinfo.json reference](https://webostv.developer.lge.com/develop/references/appinfo-json)
- [LG Seller Lounge](https://seller.lgappstv.com/)

The official CLI repository, npm package, bundled schema and command help were inspected. The LG developer website was blocked by this environment's network policy, so the portal's latest submission forms and full Developer Mode guide could not be fetched here. Check them at release time.
