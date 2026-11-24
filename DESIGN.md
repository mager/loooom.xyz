---
name: "Loooom"
description: "Night Press: clear source files, strong type, and fine woven lines."
colors:
  ink: "#111211"
  panel: "#191b18"
  panel-raised: "#20231e"
  rail: "#151713"
  paper: "#eff1e8"
  quiet: "#a6ad9f"
  line: "#34382f"
  line-strong: "#66704e"
  lime: "#d2fa69"
  lavender: "#c5b6ed"
  action-bg: "#d2fa69"
  action-hover: "#e0ff95"
  action-ink: "#19210e"
  accent-soft: "#2b3321"
  accent-border: "#536039"
  code-bg: "#171a14"
  code-toolbar: "#22271c"
  code-text: "#c3ccb6"
  code-line: "#96a087"
  code-target: "#323d24"
  code-list: "#d1c4eb"
  light-ink: "#f5f2e9"
  light-panel: "#faf9f3"
  light-panel-raised: "#eaece0"
  light-rail: "#eceee1"
  light-paper: "#25291f"
  light-quiet: "#626a56"
  light-line: "#cdd2bf"
  light-line-strong: "#7e8b69"
  light-lime: "#40571a"
  light-lavender: "#705193"
  light-accent-soft: "#e3ebd1"
  light-accent-border: "#95a576"
  light-code-bg: "#fcfbf7"
  light-code-toolbar: "#eceee1"
  light-code-text: "#46503b"
  light-code-line: "#6c755f"
  light-code-target: "#e4edcd"
  light-code-list: "#6c4c90"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 5.4rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.8rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Outfit, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
  source:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  small: "4px"
  control: "6px"
  reader: "6px"
  panel: "10px"
spacing:
  small: "8px"
  control-gap: "10px"
  compact: "12px"
  medium: "16px"
  mobile-gutter: "20px"
  large: "24px"
  narrow-gutter: "28px"
  desktop-gutter: "44px"
  wide-gutter: "64px"
components:
  button-primary:
    backgroundColor: "{colors.action-bg}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.action-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px"
  nav-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.lime}"
    rounded: "{rounded.control}"
    padding: "12px 10px"
  topic-chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.lime}"
    rounded: "{rounded.small}"
    padding: "3px 8px"
  source-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.panel}"
  source-reader:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-text}"
    typography: "{typography.source}"
    rounded: "{rounded.reader}"
---

# Design System: Loooom

## Overview

**Creative North Star: "Night Press"**

Large Outfit headings, fine woven lines, and compact source records define Loooom. Dark mode uses pale text on ink. Light mode uses dark text on warm paper. Both modes use the same layout and controls.

This system applies to every HTML page. The root layout provides one ContextShell, navigation, and footer. `src/lib/harness/context.css` defines the shared theme roles; `src/app.css` maps older component names to those roles. Skills, Gym, documentation, profiles, and account tools use the same system. Raw Markdown and API routes remain separate.

**Key Characteristics:**

- Clear type hierarchy with short, direct copy.
- Lime actions, lavender support, and quiet borders.
- Four interwoven rings in the brand mark.
- Exact source text with visible source records.
- One footer and a saved light or dark theme.

## Colors

The palette uses ink and paper for structure, lime for actions, and lavender for supporting context and evals. The frontmatter records the shared colors. Component-specific state colors remain in the stylesheet.

- **Primary:** `lime` is the accent for text, icons, focus, and selected states. `action-bg`, `action-hover`, and `action-ink` form a separate button color set.
- **Secondary:** `lavender` marks supporting context and evals. The lavender eval feature panel keeps dark text in both themes.
- **Neutral:** `ink` is the page background; `paper` is the primary text. `panel`, `panel-raised`, and `rail` separate surfaces. `quiet` supports metadata; `line` and `line-strong` define boundaries.
- **Source:** the `code-*` colors separate source text, line numbers, the toolbar, and a linked line. Keep these roles distinct from body text.
- **Light theme:** each `light-*` token replaces the matching CSS property when `html[data-theme="light"]` is set. The role names stay the same even when the color changes.

**The Action Contrast Rule.** Use `--lime` for accent text. Use `--action-bg` with `--action-ink` for primary buttons. In light mode, `--lime` becomes dark green; the action background stays bright lime.

Do not add unobserved color ramps. The CSS contains the available colors and state variants.

## Typography

**Display and interface font:** Outfit, with a sans-serif fallback.
**Source and metadata font:** Space Mono, with a monospace fallback.

Use the frontmatter hierarchy. Headings use medium weight, tight tracking, and balanced line breaks. Body copy uses regular weight. Use Space Mono for file names, hashes, commits, line numbers, and compact metadata. Use tabular numbers for comparable values.

Page introductions use a smaller heading range (`clamp(36px, 4vw, 60px)`). The home heading has route-specific responsive sizes. Source text stays at 0.875rem in both desktop and mobile readers. File detail titles use 2rem on desktop and 1.75rem on mobile. Preserve source spacing and allow long lines, URLs, and hashes to wrap inside their container.

Copy names the file or action directly. AGENTS.md leads; ME.md, SOUL.md, and DESIGN.md are optional supporting files. Keep captions short. Do not use catchphrases or labels such as “Human context” and “Open by choice.”

## Layout

The desktop shell has a fixed left rail (220px), a top action bar, and a main area with a maximum width of 1440px. Main gutters use the spacing tokens. The rail reduces to 190px at 1150px and grows to 250px from 1600px.

At 760px and below, the rail becomes a top navigation area with horizontal scrolling. Main content uses 20px side gutters. Columns stack as each route requires; keep file text and metadata inside the available width. Existing route breakpoints are listed in the sidecar, not a new uniform grid scale.

Use one sticky footer on desktop and mobile. The implementation fixes it to the viewport bottom. It contains About, the site version, “A side project by @mager,” and the Light and Dark controls. Keep all four items on one line, including at 320px. Mobile theme controls show icons with accessible text labels. Reserve the footer height (76px desktop, 60px mobile; 52px in the file reader) plus the safe-area inset in page padding.

Check the context shell at 1440px, 390px, and 320px in both themes. Confirm that the footer does not hide the final content or keyboard focus.

## Elevation & Depth

Most surfaces are flat, with borders and small changes in tone. Cards change border color on hover; they do not lift. Shadows separate the woven file fragments and the fixed footer from the page. Their exact values and theme-dependent shadow color are in the sidecar and CSS.

The weave moves slowly with a 22-second alternating turn. Control transitions last 0.2 seconds. When reduced motion is requested, disable animation and transitions and keep the weave visible in its static state.

## Shapes

Use small rounded controls and slightly softer source panels, as recorded in `rounded`. Borders are thin (1px). Avatars and the woven threads use circles or ellipses. The logo and favicon contain exactly four interwoven rings, one for each o in loooom.

## Components

- **Buttons:** solid lime for the main action; transparent with a border for secondary actions. Standard controls have a minimum height of 46px. Compact topbar actions use 38px. Retain the dark action text on hover. Disabled buttons use reduced opacity and a waiting cursor.
- **Inputs:** visible labels, neutral surfaces, a thin border, and readable placeholder text. Search and GitHub link fields may use an inline icon. Show errors beside the form with text and a distinct state treatment.
- **Navigation:** quiet links; a soft accent surface for the active route. Provide one primary share entry in the topbar. Omit that entry on the share page. Mobile navigation scrolls horizontally.
- **Topic chips:** small text labels with a soft accent fill, accent border, and modest corners. Selected filters also show a line or explicit pressed state.
- **Source cards:** owner and sharer attribution, file name, short text preview, source metadata, and separate read and save actions. Card previews use real source line numbers. Do not imply that a curated source owner is a member.
- **Source reader:** a compact filename and copy toolbar above numbered text. On file detail pages, Copy is the lime primary action and the toolbar stays visible while reading. The compact title and secondary Save/GitHub controls sit above the reader. Source details occupy a 224px side column above 1100px and move below the file on narrower screens, with a File details jump link. Snapshot details disclose the import date and hash. Show imported content as text, with neutral prose and lime headings. Use a distinct background for the linked line. Keep the source URL, commit, file update date, line count, and SHA-256 accessible.
- **Brand and weave:** four rings form the small mark. Fine crossing threads and file fragments form the larger illustration. Use the illustration where it helps explain files; keep reading and form areas clear.
- **Footer and theme control:** one continuous bar. The active theme uses the action colors and `aria-pressed`. Keep labels accessible when their visible text is hidden on mobile. Save the choice between visits.

All interactive controls need a visible keyboard focus ring (2px accent outline with a 5px offset). Keep text labels for icon controls and status text for errors and copy results.

## Do's and Don'ts

### Do:

- **Do** use the existing theme properties for every new surface.
- **Do** lead with AGENTS.md and describe other context files as optional.
- **Do** keep one primary share entry and one footer.
- **Do** preserve exact source text and separate owner and sharer attribution.
- **Do** check both themes, keyboard focus, reduced motion, and the 320px layout.

### Don't:

- **Don't** use the text accent as the primary button background in light mode.
- **Don't** add decorative gradients, large pill buttons, or the old cyan theme.
- **Don't** add catchphrases, invented activity, membership claims, or eval scores.
- **Don't** execute imported instructions or hide source records to simplify the layout.
- **Don't** add page-specific site headers, footers, or theme controls. The root layout owns these.
