# LG submission preparation — version 1.0.1

**Prepared, not submitted.** This folder contains listing copy, review guidance, privacy/support information, artwork and honest test evidence. It does not claim a completed LG certification or a passed physical-TV checklist.

## Completed LG UX template

The church supplied LG's official UX Scenario v4.4 template on October 20. Use the completed [PowerPoint/PDF files](lg-template/README.md) for the UX Scenario field instead of the earlier generic reviewer document. This does not replace LG's separate self-checklist.

## Start here

1. Read [listing copy](listing.md) and [reviewer instructions](reviewer-instructions.md).
2. Review [church-confirmed information](owner-confirmations.md) and the public [privacy policy](../docs/privacy-policy.md).
3. Open `UX-Scenario.pdf` or editable `UX-Scenario.docx` for the screen-by-screen review route.
4. Use `Self-Check-Evidence.xlsx` (or `.csv`) to transfer actual results into **LG's official current self-checklist form**. This supplemental worksheet is not a replacement for that required form. Download the official QA documents through the link in [requirements-sources.md](requirements-sources.md).
5. Use [assets/](assets/) and [screenshots/](screenshots/) subject to Seller Lounge's current format/file-size rules. Screenshots are genuine browser captures of the app, with source details in `screenshots/provenance.json`; none are claimed as TV or simulator captures.
6. Download the version 1.0.1 IPK from the repository's Downloads folder or the v1.0.1 development prerelease. Check SHA256SUMS.txt. Version 1.0.0 remains a historical development build.
7. Finish the unresolved items below before making a final submission.

## Unresolved before submission

- Complete the official LG form in the signed-in portal using actual test results; review content/age-rating answers and current listing field limits.
- Physical-TV playback/remote/lifecycle/exit checks are unperformed. The church reported a visually successful Mac webOS26 simulator launch of the earlier build; recheck the updated 1.0.1 candidate in the simulator and obtain physical results for any model groups claimed as tested.
- Production catalog CORS must be validated/resolved with the server owner. The current catalog GET has no Access-Control-Allow-Origin header. No production server changes were made.
- Review the confirmed reviewer window: Sunday worship only, starting 10:30 AM U.S. Central Time. The ending time varies; archives are the review route outside the service.
- Reconcile the model-specific webOS23–25 Back rule in LG's self-checklist with its general exit-confirmation guide before targeting those groups. No unsupported pass claim has been made.
- Review and accept the privacy policy, support details, content rights, United States distribution, category/rating and seller-account information as the church's responsible publisher.
- Confirm Seller Lounge accepts the public GitHub support/privacy URLs. If the portal requires church-domain URLs, the church website owner must publish the supplied text there; this project does not change the production server.

## Materials

- `listing.md`, `listing-fields.json`: copy/paste fields and proposed settings.
- `reviewer-instructions.md`: no-login testing route, controls, URLs and limitations.
- `UX-Scenario.pdf`, `UX-Scenario.docx`: illustrated reviewer document.
- `Self-Check-Evidence.xlsx`, `.csv`: clearly labeled actual evidence and open checks.
- `owner-confirmations.md`: contact, US distribution, rights, music exclusion, no logs and simulator report.
- `assets/store-icon-400.png`: original church cross identity, 400x400 PNG.
- `assets/store-background-1920x1080.jpg`: optional branded artwork; not a screenshot.
- `assets/splash-1920x1080.png`: copy of the packaged branded splash.
- `screenshots/01-home.jpg`, `02-sermon-library.jpg`, `03-privacy-support.jpg`, `04-exit-confirmation.jpg`: 1920x1080 browser captures.
- `evidence/`: successful 30-test run, metadata checks, official CLI package inspection, package byte comparison, and catalog-header observations.
- `requirements-sources.md`: public official LG requirements and template-download reference.

The application package is a development candidate, not a store-approved release. Only the church's authorized seller can finalize account declarations and submit through LG Seller Lounge.
