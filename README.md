# samples.libcna.com

The public gallery of XNA 4.0 samples ported to C++ with [CNA](https://github.com/libcna) and
compiled to WebAssembly. Every sample here runs in the browser on WebGL 2.

## Layout

```
index.html              gallery page 1: up to 12 cards, thumbnails and names
page-N.html             later gallery pages: up to 12 cards each, in the same order
<Sample>.html           detail page: full screenshot, description, controls, Play, prev/next
<Sample>/               the playable bundle: Emscripten .html, .js, .wasm and optional .data
assets/site.css         the whole stylesheet
assets/img/             screenshots, cropped to the game canvas, plus thumbnails
```

A detail page's **Play** button opens the sample in a new tab. Ordinary samples link directly
to `<Sample>/<Sample>_cna_samples.html`; threaded Marble Maze first opens
`MarbleMaze/launch.html` to prepare cross-origin isolation, then loads the unmodified
Emscripten shell.

## Adding a sample

1. Build the sample's WEBGL2 bundle in **Release**. Disable Emscripten threads for samples
   that do not use `System.Threading`. A Debug bundle carries DWARF sections and runs to 90 MB or more; GitHub blocks regular Git objects over 100 MB,
   and the rest is wasted bandwidth anyway. Ordinary samples use
   `-DCNA_SAMPLES_ENABLE_EMSCRIPTEN_THREADS=OFF`; `Primitives3D` was 93.5 MB as Debug and is 7.3 MB
   as a non-threaded Release WASM. `MarbleMaze` needs the original background `System.Threading.Thread`
   and is built with threads enabled. Its `launch.html` registers a service worker scoped to that game
   directory; `coi-sw.js` supplies COOP/COEP headers for its same-origin files on static GitHub Pages.
   The Emscripten shell is unmodified. The exact six-file copy was tested over plain HTTP with a clean
   Chrome profile, `crossOriginIsolated=true`, gameplay, tilt and pause.
2. Copy the bundle files into a directory named after the sample. A `.data` file exists only
   when the sample packages runtime content; Bounce has no runtime content and needs three files.
3. Crop a representative screenshot to the game canvas — no browser chrome, no Emscripten shell —
   and save it plus a thumbnail under `assets/img/`.
4. Write `<Sample>.html` from the original XNA documentation: what the sample teaches, its
   controls, and a direct source link to
   `https://github.com/libcna/cna-samples/tree/develop/samples/<Sample>`.
5. Add a card to the last gallery page (`index.html`, then `page-2.html`, etc.),
   creating a new `page-N.html` after each group of 12. Update the shown sample
   ranges, page links at the top and bottom, and `rel="prev"`/`rel="next"` links
   on adjacent gallery pages. Keep each card on exactly one page, in publication
   order. Fix the previous/next links on the neighbouring detail pages.

## Checking a bundle before publishing it

```sh
# Release bundles have no DWARF. A non-zero count here means it is a Debug build.
grep -ac debug_info <Sample>/<Sample>_cna_samples.wasm

# Ordinary GitHub Pages bundles cannot use pthreads without an isolation launcher.
# A normal bundle reports 0; MarbleMaze is the documented exception with launch.html/coi-sw.js.
grep -aEc 'PThread|shared:true|emscripten_thread' <Sample>/<Sample>_cna_samples.js
```

## Site icon

`favicon.ico` contains 16, 32, 48 and 64 pixel sizes for browsers that request
the conventional root icon. Every root-level gallery and detail page links to
`favicon-32.png` and `apple-touch-icon.png`. The icon is a generated geometric
C with an orange game pixel on the site's dark blue background. The playable
Emscripten shells remain unchanged and can use the root `favicon.ico`.

## Licence

The samples are Microsoft's, published under the Microsoft Permissive License; each sample's
original licence file travels with its source in the CNA samples repository. The C++ port and the
WebAssembly build are CNA's.
