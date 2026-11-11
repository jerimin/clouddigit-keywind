# Cloud Digit — Keycloak login theme

The branded Keycloak login theme for **Cloud Digit** (`auth.mymine.space`), built as a
container image and consumed by the OSIE Helm chart.

This is a fork of [lukin/keywind](https://github.com/lukin/keywind) — see
[Attribution](#attribution).

---

## How it reaches production

```
push to master
  → GitHub Actions builds the theme and pushes ghcr.io/jerimin/clouddigit-keywind
      tags: latest  +  sha-<short>
  → bump the sha- tag in osie-values-extra.yaml on the OSIE host
  → helm upgrade osie osie/osie -n osie -f osie-values.yaml -f osie-values-extra.yaml
```

The OSIE chart runs this image as an **initContainer** that copies `/theme` into an
`emptyDir`, mounted at `/opt/bitnami/keycloak/themes/osie`.

### Why the image is named after the theme `osie`

The OSIE chart **hardcodes** `loginTheme: osie` in
`templates/keycloak-realm-configmap.yaml`, and `keycloak-config-cli` re-imports it on
every `helm upgrade`. There is no Helm value to change it. So the branding is applied by
replacing the *content* served under the name `osie` — never by pointing the realm at a
differently-named theme, which silently reverts on the next upgrade.

### Deployments are pinned

`osie-values-extra.yaml` references an immutable `sha-<short>` tag with
`imagePullPolicy: IfNotPresent`. A push to `master` therefore **cannot** reach production
on its own — someone must deliberately bump the tag. Keep it that way; don't drift back
to `:latest`.

---

## Where the content lives

| What | File |
|---|---|
| UI tokens, light + dark (`--cd-*`, same names and values as the portal) | `src/index.css` |
| Token → utility names, ember scale, fonts, radii | `tailwind.config.ts` |
| Buttons (portal pair), focus rings, safe-area, touch targets | `src/index.css` |
| Fonts + OFL licences (self-hosted) | `theme/keywind/login/resources/fonts/` |
| Logo mark | `theme/keywind/login/components/atoms/logo.ftl` |
| All user-facing copy | `theme/keywind/login/messages/messages_en.properties` |
| Stage badge + footer | `theme/keywind/login/template.ftl` |

The reference for every value is `BRAND.md` → "UI tokens" in `jerimin/clouddigit-brand`.
Change it there first, then here.

Copy changes (title, tagline, stage wording, copyright) need only the messages file.

### Message → rendered slot

| Key | Renders as |
|---|---|
| `loginTitle` | browser `<title>` only |
| `loginTitleHtml` | the bold heading, inside `logo.ftl` |
| `loginAccountTitle` | the second line (the `<#nested "header">` slot) |
| `betaBadge` | the stage chip under the tagline ("Early access") |
| `betaNotice`, `copyrightNotice` | the footer below the card |

---

## Gotchas — read before editing

- **WebAuthn types and TypeScript >= 5.7.** TS 5.7 made `Uint8Array` generic, so
  `base64url.parse()` (typed `Uint8Array<ArrayBufferLike>`) stopped satisfying `BufferSource`
  and upstream keywind no longer compiles. This fork wraps those values in `new Uint8Array(...)`
  so they are ArrayBuffer-backed — submitted upstream as
  [lukin/keywind#113](https://github.com/lukin/keywind/pull/113). **There is no TypeScript pin**;
  builds resolve the latest 5.x. If you sync from upstream and the build breaks with
  `TS2322 Uint8Array<ArrayBufferLike> is not assignable to BufferSource`, re-apply that fix
  rather than pinning TypeScript.

- **Vite writes to `theme/keywind/login/resources/dist/`, not `login/dist/`.**
  `theme.properties` lists `dist/index.css` under `styles` because Keycloak resolves style paths
  relative to `resources/`. Checking `/theme/login/dist` looks like a broken build; it isn't.

- **Keycloak runs messages through `MessageFormat`, which eats single quotes** — even
  with no parameters. Apostrophes must be doubled: `what''s` renders as `what's`.

- **Non-ASCII in `.properties` must be `\uXXXX`-escaped.** Java reads these files as
  ISO-8859-1. The theme uses `\u00A9` (©).

- **Templates use token utilities (`bg-surface`, `text-ink-muted`, `border-line`, ...), not
  fixed colours.** Each one reads a `--cd-*` custom property, so dark mode is one swap of
  values under `prefers-color-scheme: dark` in `src/index.css`. Grep the built CSS for the
  token hex (e.g. `#C45308`). The `primary` ember scale only appears in the built CSS when a
  template uses a `primary-*` class, as `R G B` triples.

- **Dark mode recolours artwork by attribute selector** (`src/index.css`): the lockup's
  `fill="#17161c"` / `fill="#6a6873"` paths take the reversed lockup colours, and the GitHub,
  Apple and PayPal marks turn light. A regenerated lockup must keep those two fills, or update
  the selectors. (Dark mode was reverted once because the GitHub icon went invisible.)

- **`@tailwindcss/forms` hardcodes blue-600 focus rings and white fields.** `src/index.css`
  re-points them at the tokens; removing that override brings the blue back.

- **Fonts are not part of the Vite build.** `theme.properties` loads
  `fonts/fonts.css` before `dist/index.css`, so the font URLs stay relative to
  `resources/fonts/`. Keep the OFL texts beside the `.woff2` files.

- **The copyright year is literal.** Bump it each January. FreeMarker's `.now?string("yyyy")`
  was deliberately avoided: if Keycloak's FreeMarker sandbox rejects the special variable,
  the entire login page errors — a far worse failure than a stale year.

---

## Local development

```sh
npm install
npm run dev     # preview at the vite dev server
npm run build   # emits theme/keywind/login/resources/dist/
```

---

## Attribution

Forked from **[lukin/keywind](https://github.com/lukin/keywind)**, licensed under the
Apache License 2.0. The original `LICENSE` is retained unchanged.

Modifications made in this fork:

- `tailwind.config.ts` — Cloud Digit ember scale as `primary`, token colours, fonts, radii
- `theme/keywind/login/components/**` — token colours, 10px controls, 16px card, dark mode
- `theme/keywind/login/resources/fonts/` — added: Plus Jakarta Sans, JetBrains Mono (SIL OFL 1.1)
- `theme/keywind/login/components/atoms/logo.ftl` — added the Cloud Digit mark
- `theme/keywind/login/components/atoms/input.ftl` — mobile input attributes
  (`autocapitalize`, `autocorrect`, `spellcheck`, `enterkeyhint`) and an enlarged,
  labelled password-reveal target
- `theme/keywind/login/template.ftl` — always emit `<html lang>`; added the stage badge
  and the stage/copyright footer
- `theme/keywind/login/login.ftl` — `autocomplete="current-password"`
- `theme/keywind/login/messages/messages_en.properties` — added (not present upstream)
- `src/index.css` — Cloud Digit UI tokens (light + dark), portal buttons, brand focus rings,
  safe-area insets, touch-target minimums
- `src/data/webAuthn{Register,Authenticate}.ts` — ArrayBuffer-backed `BufferSource`
  values so the project builds on TypeScript >= 5.7 (upstream PR #113)
- `Dockerfile`, `.github/workflows/build-theme.yml` — added for the image build

Upstream keywind is © its authors; Cloud Digit branding and copy are © Cloud Digit.
