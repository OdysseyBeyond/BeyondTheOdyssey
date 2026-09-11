# jeonghwanlee — homepage

One file. No build step, no dependencies, no framework.

```
my_homepage/
├── index.html              the entire site (markup + CSS + JS inline)
├── check.sh                pre-publish check  (local only, not published)
├── publications.private.js unpublished work, kept out of the repo
├── .gitignore
└── .nojekyll               stops GitHub Pages running Jekyll over it
```

## Run it

```sh
cd ~/Desktop/my_homepage
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing

Everything is in `index.html`, in source order: `<style>`, then the page, then
one `<script>`. The parts you will touch:

| What | Where |
| ---- | ----- |
| Intro sentence | `<p class="statement">` |
| Field / Affiliation / Topics | `<dl class="facts">` |
| Research areas | `<ul class="fields">` — `data-topic` ties a card to the paper filter |
| Papers | `<ol class="grid">` — one `<li class="tile">` each |
| Talks | `<ol class="rows">` — a commented-out template sits above the placeholder row |
| Links | `<ul class="elsewhere">` — GitHub and ORCID are commented out |

**Adding a paper.** Copy a `<li class="tile">` block. `data-topics` takes one or
more of `isogeny`, `lattice`, `impl` (space separated) and drives the filter
buttons. Add `class="tile feature"` to make it span two columns with the large
venue type. Then update the three counts by hand: `All (7)` in the filters, the
`7` in the "View papers" button, and the per-area counts in the research cards.

**Only list public work.** Every paper on the page links to a public ePrint,
TCHES or Springer page. Work that is not public yet lives in
`publications.private.js`, which is gitignored and never deployed — `check.sh`
fails if any of it reaches `index.html`.

## The plate

The grey panel is the Hopf fibration. A unit quaternion `q = z₁ + z₂j` has fibre
`{e^{iθ}q}`, a circle in S³; base points on three latitudes of S² give three
nested tori, drawn after stereographic projection to ℝ³.

The drawing is exactly as you authored it. If you ever want to tune it, the two
numbers that matter are both in `draw()`: `a4 = 0.35 * Math.sin(t * 0.07)` is the
rotation of S³, and `if (d < 0.02)` is how close to the projection pole a point
may get before the stroke breaks.

It honours `prefers-reduced-motion`: a single static frame, no animation loop.
The loop also stops when the panel scrolls out of view.

## Before publishing

```sh
./check.sh
```

Lists what would be published and fails on unpublished research, mojibake
(this file has been corrupted by a Latin-1 round-trip before), or dead links.
`--fast` skips the network check.

## Deploying

GitHub Pages, user site:

```sh
./check.sh && git push -u origin main
```

Repository must be named `<username>.github.io`, then Settings → Pages → deploy
from `main` / root. Note that a free account only serves Pages from a **public**
repository.
