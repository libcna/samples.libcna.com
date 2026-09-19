# samples.libcna.com

The public gallery of XNA 4.0 samples ported to C++ with [CNA](https://github.com/libcna) and
compiled to WebAssembly. Every sample here runs in the browser on WebGL 2.

## Layout

```
index.html              gallery: one card per sample, thumbnail and name
<Sample>.html           detail page: full screenshot, description, controls, Play, prev/next
<Sample>/               the playable bundle: Emscripten .html, .js, .wasm and optional .data
assets/site.css         the whole stylesheet
assets/img/             screenshots, cropped to the game canvas, plus thumbnails
```

A detail page's **Play** button opens `<Sample>/<Sample>_cna_samples.html` in a new tab. That file
is Emscripten's own shell, unmodified.

## Adding a sample

1. Build the sample's WEBGL2 bundle **in Release with Emscripten threads disabled**. A Debug bundle
   carries DWARF sections and runs to 90 MB or more; GitHub blocks regular Git objects over 100 MB,
   and the rest is wasted bandwidth anyway. GitHub Pages also cannot set the COOP/COEP headers
   required by pthread builds. Configure samples with
   `-DCNA_SAMPLES_ENABLE_EMSCRIPTEN_THREADS=OFF`; `Primitives3D` was 93.5 MB as Debug and is 7.3 MB
   as a non-threaded Release WASM.
2. Copy the bundle files into a directory named after the sample. A `.data` file exists only
   when the sample packages runtime content; Bounce has no runtime content and needs three files.
3. Crop a representative screenshot to the game canvas — no browser chrome, no Emscripten shell —
   and save it plus a thumbnail under `assets/img/`.
4. Write `<Sample>.html` from the original XNA documentation: what the sample teaches, its
   controls, and a direct source link to
   `https://github.com/libcna/cna-samples/tree/develop/samples/<Sample>`.
5. Add a card to `index.html`, and fix the previous/next links on the neighbouring detail pages.

## Checking a bundle before publishing it

```sh
# Release bundles have no DWARF. A non-zero count here means it is a Debug build.
grep -ac debug_info <Sample>/<Sample>_cna_samples.wasm

# GitHub Pages cannot set COOP/COEP headers, so pthread/shared-memory runtime markers
# must all be absent. A valid static bundle reports 0.
grep -aEc 'PThread|shared:true|emscripten_thread' <Sample>/<Sample>_cna_samples.js
```

## Licence

The samples are Microsoft's, published under the Microsoft Permissive License; each sample's
original licence file travels with its source in the CNA samples repository. The C++ port and the
WebAssembly build are CNA's.
