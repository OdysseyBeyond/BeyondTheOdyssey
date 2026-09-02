# jeonghwanlee — personal homepage

A static site. No build step, no dependencies, no `node_modules`. Open the files,
edit them, push them.

```
my_homepage/
├── index.html          # the illustrated scene (desktop) + a separate mobile layout
├── research.html
├── publications.html
├── cv.html
├── teaching.html
├── contact.html
└── assets/
    ├── site.css        # design tokens + every style
    ├── data.js         # ← single source of truth: papers, research, CV, teaching
    ├── render.js       # renders the subpages from data.js
    ├── search.js       # dependency-free fuzzy search
    ├── scene.js        # hotspot tooltips + optional raster hero override
    └── mailto.js       # assembles the email address in JS (anti-scrape)
```

## Run it

```sh
cd ~/Desktop/my_homepage
python3 -m http.server 8000
# then open http://localhost:8000
```

`file://` works too, but use the server — it matches how it will be deployed.

## Architecture

The homepage is the three-layer structure, not a flat picture:

1. **Layer 1 — art.** An inline SVG scene (`index.html`). Vector, so it is sharp at
   every resolution and each object is individually addressable.
2. **Layer 2 — real HTML UI.** The name, the search box and the five circular nav
   buttons are ordinary DOM, positioned in **percentages** so they track the art at
   any window size. They stay selectable, focusable and indexable by Google.
3. **Layer 3 — clickable illustrated objects.** Seven `.hotspot` groups inside the
   SVG lift on hover, show a tooltip, take keyboard focus and navigate on Enter:

   | Object                     | Goes to                        |
   | -------------------------- | ------------------------------ |
   | Chalkboard `L = BZⁿ`       | `research.html#threshold-fhe`  |
   | Lattice graph (bottom left)| `research.html#lattices`       |
   | Books / picnic             | `research.html#number-theory`  |
   | Padlock + key              | `research.html#cryptanalysis`  |
   | Discrete Gaussian notebook | `research.html#lattices`       |
   | Temple + CRYPTO flag       | `publications.html`            |
   | Clock tower                | `teaching.html`                |

Below 820px the scene is replaced wholesale by `.home-mobile` — a separate
composition, because shrinking a 1664×928 illustration to 390px shows nothing.

## Editing content

**Everything lives in `assets/data.js`.** The subpages have no hard-coded content;
they render from that file, and the search index is built from it too. Add a paper
to `PUBLICATIONS` and it appears on the publications page, in the topic filters and
in search, with no other edits.

### Still to fill in

| Where | What |
| ----- | ---- |
| `SITE.role` | Your exact title |
| `SITE.email` | `hwani0814@korea.ac.kr` — change here if you want a different public address |
| `SITE.links` | Scholar, ORCID, DBLP, GitHub, ePrint. Empty strings are hidden; filled ones appear as cards on Contact |
| `SITE.links.cvPdf` | Path to a CV PDF. Until set, the download button is removed |
| `PUBLICATIONS[].venue` + `.status` | Titles and author lists came from your LaTeX sources and are real. Venues and years are **not** claimed — entries show "Under submission" / "Manuscript" until you set `venue` and `status: "published"` |
| `PUBLICATIONS[].note` | Several read `TODO: confirm author list` — those are papers whose `.tex` still had template authors (Michael Shell, Homer Simpson). They render with a dashed amber badge so they are easy to spot |
| `PUBLICATIONS[].links` | e.g. `{ ePrint: "https://eprint.iacr.org/2026/123" }` |
| `CV.education`, `CV.experience`, `CV.service` | Placeholders. `CV.awards` is already filled from your 2025 competition results |
| `TEACHING` | Empty scaffold — I could not tell from your files which courses you taught versus took, so nothing is asserted |

## Using the original illustration instead of the vector scene

Drop the raster at `assets/hero.webp` (or `.png` / `.jpg`). `scene.js` probes for it
and cross-fades it over the vector scene automatically — no code change. The HTML UI
and the hotspots stay on top and keep working, but the hotspot coordinates are tuned
to the vector scene, so nudge them in `index.html` if the compositions differ.

To go back to the vector scene, delete the file.

## Deploying

**GitHub Pages** — this is already a plain static site, so:

```sh
git init && git add -A && git commit -m "homepage"
git branch -M main
git remote add origin https://github.com/<you>/<you>.github.io.git
git push -u origin main
```

Then Settings → Pages → Deploy from branch → `main` / root.

**Vercel / Netlify / Cloudflare Pages** — drag the folder in, or point it at the repo.
No build command, output directory `.`.

## Notes

- Dark mode follows the OS on the reading pages; the homepage scene is always twilight.
- `prefers-reduced-motion` disables the twinkling, the plane and the bobbing whale.
- `/` from anywhere focuses the search box; `↑ ↓` move through results, `Enter` opens.
- `cv.html` has a print stylesheet — Cmd-P gives a clean one-column CV.
- The email is assembled by `mailto.js` at runtime, so it is not sitting in the HTML
  source for scrapers.
