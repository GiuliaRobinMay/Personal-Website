# Giulia May — website (2026 rebuild)

A one-page site for the new positioning: **custom software built into large communities.**
Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` straight off disk also works, but a local server is closer to production.

## Deploy

**Cloudflare Pages** — connect the repo, then:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(leave empty)* |
| Build output directory | *(leave empty — files are at the repo root)* |

**Vercel** — connect the repo, then:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | *(leave empty — files are at the repo root)* |
| Build command | *(leave empty)* |
| Output directory | *(leave empty)* |

Both serve it as static files. Point `giuliamay.com` at whichever one you pick,
and only then take the Squarespace site down.

## Layout

```
index.html              the whole page
  favicon.svg
  assets/css/site.css     tokens at the top, then sections in page order
  assets/js/site.js       the six live demos, one block each
  assets/fonts/           Playfair Display, DM Sans, Brittany Signature (self-hosted)
  assets/img/             brand-shoot photos, resized for the web
```

Fonts are **self-hosted on purpose**. No Google Fonts request, so the page has no
third-party dependency and nothing to disclose in a cookie banner.

## Brand rules baked into the CSS

Every colour is a token at the top of `site.css`. Do not hand-write hex values below that block.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#FAF8F4` | base ground, roughly 45% of the page |
| `--ink` | `#211C18` | text, and the dark bands |
| `--red` | `#E2431E` | lead accent, primary action |
| `--sky` | `#C9D6E8` | secondary ground |
| `--rose` | `#D6536D` | lead accent partner |
| `--olive` | `#5E6B33` | supporting |
| `--gold` | `#EBB11D` | supporting, small doses |

Which colours may sit on which ground:

| Background | Allowed on it |
| --- | --- |
| Near-white | Ink, Red, Olive, Rose |
| Ink | Near-white, Red, Sky, Rose, Gold |
| Sky | Red, Olive, Rose |
| Red / Olive / Rose | Sky |
| Gold | Rose |

Near-white and Ink are always valid on any ground.

Also fixed by the brand: **square corners everywhere**, fine ink rules, **no gradients**,
and buttons as a rectangle with an uppercase DM Sans label plus an arrow-number footnote.

## The live demos

Six working pieces in `site.js`, each independent. They are the argument the page makes:
it does not describe custom member experiences, it runs six of them.

| Demo | What it does |
| --- | --- |
| Daily menu | Reads the real weekday and shows that day's programme |
| Test | Three questions, tallies an answer type, returns a result |
| Roadmap | Click any stage, progress recalculates |
| Course | Lessons complete and unlock in order |
| Checklist | Ticking fills the bar, finishing reveals the closing note |
| Bot | Keyword-matched answers over a small scripted corpus |

To swap a demo's content, edit the array at the top of its block. The rendering below it
does not need to change.

## Still open

Anything undecided is wrapped in `class="ph"` and carries a rose `.ph-tag` label, so it
cannot be mistaken for a finished choice. Two are live right now:

1. **The headline.** Currently a plain holding line. Not the answer.
2. **Testimonials.** Three empty cards waiting for real quotes.

To ship an item: delete its `.ph-tag` element and drop the `ph` class from its wrapper.

Other things to wire before launch:

- The **Book a build call** buttons point at `#`. Give them a real booking link.
- The **newsletter form** is not connected. It shows a notice saying so.
- Footer links to Big Tribe Builders, QuinB Academy and socials are placeholders.
