# Dauntless Revived Command Center — v0.3

Independent fan-made web companion for Dauntless Revived. No live game connection is implemented.

## Features in this preview
- Mobile-responsive dark fantasy dashboard
- Local Slayer profile
- Experimental arithmetic damage calculator (not verified against game mechanics)
- Create builds and export/import companion JSON backups
- Manual hunt recording, duration graph, and personal bests
- Local achievement notes
- Account Integration information screen: no account key collection

All profile, build, hunt and note data is stored in your browser localStorage. Export regularly; clearing browser storage or switching devices will not transfer it.

## GitHub Pages
Settings → Pages → Deploy from branch → main → / (root) → Save.
Once published: https://mrsporky.github.io/Dauntless-Revived-Stats/

## Account link architecture (not implemented)
The upstream Dauntless Revived repository describes self-hosted servers with personal account keys. Never send keys to this static frontend, embed keys in JavaScript, or commit them. Live integration needs **explicit permission from the server administrator** and a dedicated HTTPS backend. Preferred design: server issues a short-lived, read-only companion token scoped to the relevant player after authentication; backend validates it with that server and returns only approved stats to the browser. Until such an API exists, use manual companion records or a vetted, non-secret export.

Upstream: https://github.com/mixutin/dauntless-revived

## Official server compatibility
Official documentation: https://mixutin.github.io/dauntless-revived/reference/api.html

The documented account key is a full game-login credential and has no self-service revocation route. **Do not ask users to enter it in GitHub Pages.** The existing endpoints are game endpoints, not a scoped third-party companion authorization flow. For live integration, seek server-owner approval for a dedicated read-only endpoint and short-lived, limited-scope authorization. A static demo must not claim a live connection. Manual entry and locally imported non-secret exports remain available.

## Verified upstream integration research (October 2026)

Official documentation: https://mixutin.github.io/dauntless-revived/reference/api.html

The private server supports the following player-token authenticated read endpoints, subject to actual server configuration and administrator permission:
- `GET /progression/:userId` (own tracks/mastery)
- `GET /progression/objectives/:userId` (own objectives)
- `GET /huntpass/:userId` (selected Hunt Pass)
- `GET /entitlementsv2` (account entitlements)
- Further inventory, character and loadout GET routes are described in the API reference.

**Do not implement browser-based exchange of account keys**: `UUK_` keys permit game login and access to other account functions, and cannot currently be revoked through an API. A player JWT also grants access to game routes and is not inherently read-only. Browser CORS support and administrator consent must be verified. If an official limited-scope companion token or admin-approved export is unavailable, prefer non-secret data export and local import. Never expose account credentials, server admin keys or full player tokens through GitHub Pages or the repo.

Suggested next step: coordinate with server owner on a new read-only `/companion/v1/me` endpoint with explicit permission, scoped short-lived authorization, allowed origins, rate limits and minimal data, before implementing live sync.


## v0.4: Local-only Slayer Statistics
The **Slayer Stats** tab can read our own `dauntless-command-center-stats-v1` JSON snapshot. It displays Slayer level, Hunt Pass level, mastery, currencies, inventory (with text search) and loadouts, entirely in the browser. Click **Download example** for the expected JSON structure. Imported data is not live or independently verified. Import is restricted to the expected fields and rejects common account credential patterns. Do not place any game account key or token in imports.

This format is **not an official Dauntless Revived export**. Future mapping from an actual server-provided *non-secret, approved export* will require that server's export schema and permission.

### Real sync requirements
The upstream Dauntless Revived docs (https://mixutin.github.io/dauntless-revived/reference/api.html) describe authenticated GET routes such as `/character`, `/inventory/:userId/:characterId`, `/progression/:userId` and `/loadout/:characterId`. The existing `UUK_` account key can log in as its owner and currently has no public revoke/reissue API. Player JWTs likewise can invoke all that player's game routes; they are not restricted read-only credentials. Do not put either credential in GitHub Pages, browser localStorage, uploaded JSON, issues, commits or third-party backend logs.

Live syncing requires consent from the **actual server administrator**, confirmation of which server hosts the player, and ideally a server-side narrowly scoped, short-lived companion token or server-provided stats export. A static GitHub Pages site cannot keep backend secrets; an approved live-sync service would be a separate HTTPS backend with CORS, rate limits, secure server-only credentials, and a privacy policy. The upstream documentation describes its own host as invite-only, not a universal public server. Verify the specific host before attempting integration.
