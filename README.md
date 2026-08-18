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
| Brand colour scale | `tailwind.config.ts` → `colors.primary` |
| Logo mark | `theme/keywind/login/components/atoms/logo.ftl` |
| All user-facing copy | `theme/keywind/login/messages/messages_en.properties` |
| Beta badge + footer | `theme/keywind/login/template.ftl` |
| Focus rings, safe-area, touch targets | `src/index.css` |

Copy changes (title, tagline, beta wording, copyright) need only the messages file.

### Message → rendered slot

| Key | Renders as |
|---|---|
| `loginTitle` | browser `<title>` only |
| `loginTitleHtml` | the bold heading, inside `logo.ftl` |
| `loginAccountTitle` | the second line (the `<#nested "header">` slot) |
| `betaBadge` | the pill under the tagline |
| `betaNotice`, `copyrightNotice` | the footer below the card |

---

## Gotchas — read before editing

- **TypeScript is pinned to `5.5.4`.** Upstream keywind does not compile on TS ≥ 5.7:
  `src/data/webAuthnRegister.ts` fails with
  `TS2322 Uint8Array<ArrayBufferLike> is not assignable to BufferSource`, because TS 5.7
  made `Uint8Array` generic. keywind declares `^5.2.2`, so an unpinned `npm install`
  floats to a broken version. Do not "modernise" this pin without fixing that file.

- **Vite writes to `theme/keywind/login/resources/dist/`, not `login/dist/`.**
  `theme.properties` says `styles=dist/index.css` because Keycloak resolves style paths
  relative to `resources/`. Checking `/theme/login/dist` looks like a broken build; it isn't.

- **Keycloak runs messages through `MessageFormat`, which eats single quotes** — even
  with no parameters. Apostrophes must be doubled: `what''s` renders as `what's`.

- **Non-ASCII in `.properties` must be `\uXXXX`-escaped.** Java reads these files as
  ISO-8859-1. The theme uses `\u00A9` (©) and `\u03B2` (β).

- **The beta badge must not carry the CSS `uppercase` class.** `text-transform: uppercase`
  turns `βeta` into Greek capital `ΒΕΤΑ`, which is indistinguishable from Latin "BETA".

- **Tailwind only emits colours actually used by the `.ftl` templates, as `R G B` triples.**
  Grepping the built CSS for `#f6821f` returns nothing even on a correct build — grep
  `246 130 31` instead.

- **`@tailwindcss/forms` hardcodes blue-600 focus rings.** `src/index.css` re-points them
  at the brand scale; removing that override brings the blue back.

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

- `tailwind.config.ts` — replaced the `primary` colour scale with Cloud Digit brand colours
- `theme/keywind/login/components/atoms/logo.ftl` — added the Cloud Digit mark
- `theme/keywind/login/components/atoms/input.ftl` — mobile input attributes
  (`autocapitalize`, `autocorrect`, `spellcheck`, `enterkeyhint`) and an enlarged,
  labelled password-reveal target
- `theme/keywind/login/template.ftl` — always emit `<html lang>`; added the beta badge
  and the beta/copyright footer
- `theme/keywind/login/login.ftl` — `autocomplete="current-password"`
- `theme/keywind/login/messages/messages_en.properties` — added (not present upstream)
- `src/index.css` — brand focus rings, safe-area insets, touch-target minimums
- `package.json` — pinned TypeScript to 5.5.4
- `Dockerfile`, `.github/workflows/build-theme.yml` — added for the image build

Upstream keywind is © its authors; Cloud Digit branding and copy are © Cloud Digit.
