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

Everything is in `index.html`: `<style>`, then the page, then one `<script>`.

| What | Where |
| ---- | ----- |
| Intro sentence | `<p class="statement">` in `#about` |
| Research areas | `<ul class="interests">` |
| Papers | `<div class="year-group">` per year, one `<li class="pub">` each |
| Talks | `<ol class="talks">` — a commented-out template sits above the placeholder |
| Links | `<ul class="elsewhere">` — GitHub and ORCID are commented out |

**Adding a paper.** Copy a `<li class="pub">`. `data-topics` takes one or more of
`isogeny`, `lattice`, `impl` and drives the filter buttons; the coloured dots in
`.meta` are set by hand with `--c: var(--viridian|--indigo|--madder)`. If the
year has no group yet, copy a whole `<div class="year-group">`.

**Only list public work.** Every paper links to a public ePrint, TCHES or
Springer page. Anything not public yet stays in `publications.private.js`, which
is gitignored — `check.sh` fails if it reaches `index.html`.

## The plate

The hero is the Hopf fibration. A unit quaternion `q = z₁ + z₂j` has fibre
`{e^{iθ}q}`, a circle in S³; base points on three latitudes of S² give three
nested tori, stereographically projected and coloured by longitude through an
indigo → viridian → madder → gamboge ramp.

It honours `prefers-reduced-motion` (one static frame, no loop) and stops
animating when the hero scrolls out of view.

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
