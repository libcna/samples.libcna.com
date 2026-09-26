// Supply isolation headers to the threaded WebGL bundle on static hosting.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
    if (new URL(event.request.url).origin !== self.location.origin) return;
    event.respondWith((async () => {
        // A 304 cannot be reconstructed as a Response with a body. Fetch the actual
        // bytes so every controlled navigation receives the isolation headers.
        const response = await fetch(event.request, {cache: 'no-store'});
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        headers.set('Cross-Origin-Resource-Policy', 'same-origin');
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    })());
});
