# Figma Assets Manifest

Source: Figma file `eGLOYoFXEU2OAeejELIR3x`, node `8056:210` ("Full HD Main").
Downloaded via Figma MCP `get_design_context` / `download_assets` and saved under
`apps/web/public/assets/`.

| Local file | Figma asset (node / purpose) |
| --- | --- |
| `assets/icons/dropdown-arrow.svg` | Dropdown Arrow (node `8032:1137`) — user profile menu caret |
| `assets/icons/home.svg` | "Home" nav icon, `boxicons:home-filled` (node `8169:75`) — re-synced after the old black PNG mask was replaced with a proper SVG in Figma |
| `assets/icons/nav-create.svg` | "Create" nav icon (node `8056:237`) |
| `assets/icons/nav-search.svg` | "Search" nav icon (node `8056:243`) |
| `assets/icons/nav-mail.svg` | "Mail" nav icon (node `8056:251`) |
| `assets/icons/nav-bolo.svg` | "BOLO" nav icon (node `8056:258`) |
| `assets/icons/nav-notes.svg` | "Notes" nav icon (node `8056:264`) |
| `assets/icons/nav-refresh.svg` | "Refresh" nav icon (node `8056:271`) |
| `assets/icons/nav-close.svg` | "Close" nav icon (node `8056:277`) |
| `assets/icons/taskbar-search.svg` | Task bar search icon (node `8056:306`) |
| `assets/icons/window-back.svg` | Module window breadcrumb bar back/forward arrow, `basil:arrow-left-outline` (from node `8056:429` "Full HD Human", window chrome `8056:383`) — forward reuses the same asset rotated 180deg |
| `assets/icons/window-chevron.svg` | Module window breadcrumb separator, `akar-icons:chevron-right-small` (node `8056:429`) |
| `assets/icons/bg-ellipse-1.svg` | Background gradient ellipse (node `8056:291`) |
| `assets/icons/bg-ellipse-2.svg` | Background gradient ellipse (node `8056:292`) |
| `assets/icons/window-logo.svg` | Window bar small app glyph (node `8056:214`) |
| `assets/images/sheriff-badge.png` | Deputy star / sheriff badge image (node `8056:294`) |
| `assets/apps/mail.png` | App tile icon — Почта (node `8056:328`) |
| `assets/apps/cases.png` | App tile icon — Дела (node `8056:332`) |
| `assets/apps/notes.png` | App tile icon — Заметки (node `8056:336`) |
| `assets/apps/admin.png` | App tile icon — Админ (node `8056:340`) |
| `assets/apps/reports.png` | App tile icon — Рапорты (node `8056:344`) |
| `assets/apps/arrests.png` | App tile icon — Аресты (node `8056:348`) |
| `assets/apps/forensics.png` | App tile icon — Экспертизы (node `8056:352`) |
| `assets/apps/warrants.png` | App tile icon — Ордера (node `8056:356`) |
| `assets/apps/laws.png` | App tile icon — Законы (node `8056:360`) |
| `assets/apps/people.png` | App tile icon — Люди (node `8056:364`) |
| `assets/apps/dmv.png` | App tile icon — DMV (node `8056:368`) |
| `assets/apps/weapons.png` | App tile icon — Оружие (node `8056:372`) |
| `assets/apps/bolo.png` | App tile icon — BOLO (node `8056:376`) |
| `assets/apps/calls.png` | App tile icon — Вызовы (node `8056:380`) |

## Fonts (not downloaded, loaded via web font / system fallback)

- **Inter** (Semi Bold / Medium / Regular) — loaded via Google Fonts `@import` in
  `src/styles/index.css`.
- **Segoe Fluent Icons** — Windows 11 system icon font used for OS-chrome glyphs
  (window caption buttons, WiFi/speaker tray icons). Not bundled (system font);
  CSS falls back to `Segoe MDL2 Assets` (Windows 10) then `sans-serif`. Since FiveM
  only runs on Windows, this is acceptable without self-hosting a font file.

## Re-syncing

To re-pull a node, call `get_design_context` then `download_assets` against file key
`eGLOYoFXEU2OAeejELIR3x` with the target node id, then re-run the `curl` downloads with
the new asset hash from the response and update this table.
