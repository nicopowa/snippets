const cacheName = "snippet-v1"

const snippetFiles = [

	"",
	"index.html", 

	"js/lib/bliss.shy.min.js", 
	"js/lib/prism-live-css.js", 
	"js/lib/prism-live-javascript.js", 
	"js/lib/prism-live-markup.js", 
	"js/lib/prism-live.js", 
	"js/lib/prism.min.js", 

	"js/snippetplayground.package.release.min.js", 

	"css/lib/prism-live.css", 
	"css/lib/prism.dark.min.css", 
	"css/lib/prism.min.css", 

	"css/snippetplayground.package.min.css", 

	"apple-touch-icon-precomposed.png", 
	"apple-touch-icon.png", 

	"favicon.ico", 

	"icon.png", 
	"icon32.png", 
	"iconmask.png"
]
.map(
	filePath => 
		"../" + filePath
);

self
.addEventListener(
    "install", 
    evt => {

        console.log("service worker install");

        evt
		.waitUntil(
            caches
            .open(cacheName)
            .then(
				cache => 
					cache
					.addAll(snippetFiles)
					.then(
						() => {

							console.log("service worker installed");
							
						}
					)
			)
			.catch(
				err => {

					console.error("service worker install fail", err);

				}
			),
		);

    }
);

self
.addEventListener(
	"fetch", 
	evt => {

		let req = evt.request;

		console.log("sw fetch", req.url);

		if(!req.url.startsWith("http")) 
			return;

		caches
		.match(req)
		.then(
			() => {

			}
		)
		
		evt
		.respondWith(
			(async () => {
				const r = await caches.match(e.request);
				console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
				if (r) return r;
				const response = await fetch(e.request);
				const cache = await caches.open(cacheName);
				console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
				cache.put(e.request, response.clone());
				return response;
			})()
		);
	}
);
