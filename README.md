# Giulia May — website (2026 rebuild)

A one-page site for the positioning: **vibe-coded custom software, AI systems, automations
and MCP servers, built into large communities.**
Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

## The argument the page makes

Three frameworks, stacked, in this order:

| Layer | Where it shows up |
| --- | --- |
| **StoryBrand** (Donald Miller) | The client is the hero, not Giulia. Problem → guide → plan → call to action → stakes → success. Sections 03, 05, 08, 11. |
| **Wes McDowell** | Clarity over cleverness in the hero, one repeated primary CTA, a transitional CTA (newsletter) for people not ready, and an FAQ that answers objections instead of hiding them. |
| **Seth Godin** (*Tribes*, *Purple Cow*) | Section 04, the manifesto. A flag to stand under, a named heresy, and the smallest-viable-tribe argument. This is what makes the site remarkable rather than merely clear. |

The heresy is stated out loud in creed 05 and answered head-on as the first FAQ:
vibe coding in untrained hands makes fragile toys — the 25 years is the whole point.

## Run it locally

```bash
cd giuliamay-site
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
| Build output directory | `giuliamay-site` |

**Vercel** — connect the repo, then:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | `giuliamay-site` |
| Build command | *(leave empty)* |
| Output directory | *(leave empty)* |

Both serve it as static files. Point `giuliamay.com` at whichever one you pick,
and only then take the Squarespace site down.

## Layout

```
giuliamay-site/
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

Ten working pieces in `site.js`, each independent, in two groups. They are the argument
the page makes: it does not describe custom member experiences, it runs ten of them.

**What members touch**

| Demo | What it does |
| --- | --- |
| Daily menu | Reads the real weekday and shows that day's programme |
| Test | Three questions, tallies an answer type, returns a result |
| Roadmap | Click any stage, progress recalculates |
| Course | Lessons complete and unlock in order |
| Checklist | Ticking fills the bar, finishing reveals the closing note |
| Bot | Keyword-matched answers over a small scripted corpus |

**The engine behind it**

| Demo | What it does |
| --- | --- |
| Automations | Press run, the six-step pipeline executes on a timer, step by step |
| MCP servers | Pick a question, watch the tool calls fire before the answer lands |
| Second brain | Search a small corpus, get an answer with its sources attached |
| Integrations | Click a tool, see what flows in and out of it |

To swap a demo's content, edit the array at the top of its block (`FLOW`, `MCP`, `BRAIN`,
`TOOLS`, and so on). The rendering below it does not need to change.

Anyone with `prefers-reduced-motion` set gets the timed demos instantly rather than
stepped — see the `CALM` / `after()` helper at the top of `site.js`.

## Still open

Anything undecided is wrapped in `class="ph"` and carries a rose `.ph-tag` label, so it
cannot be mistaken for a finished choice. One is live right now:

1. **Testimonials.** Three empty cards waiting for real quotes. These matter more than
   anything else left on this list — the page currently asserts the track record and
   never has a client confirm it.

To ship an item: delete its `.ph-tag` element and drop the `ph` class from its wrapper.

Other things to wire before launch:

- The **booking link**. Every button that should open the calendar is marked `data-book`,
  so `grep data-book index.html` finds all of them. Three today: nav, hero, close.
- The **newsletter form** is not connected. It shows a notice saying so.
- Footer links to Big Tribe Builders, QuinB Academy and socials are placeholders.
- The **proof strip numbers** (25 / 300+ / 25,000+ / 5.0) carried over from the previous
  draft. Confirm they are still the ones you want to stand behind.
