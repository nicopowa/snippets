class SnippetsService {

	constructor(that) {

		this.cacheName = "snippets";

		this.cacheVersion = 1;

		this.cacheStorage = this.cacheName + "-" + this.cacheVersion;

		this.cacheFiles = [

			"",
			"index.html", 
		
			"js/lib/bliss.shy.min.js", 
			"js/lib/prism-live-css.js", 
			"js/lib/prism-live-javascript.js", 
			"js/lib/prism-live-markup.js", 
			"js/lib/prism-live.js", 
			"js/lib/prism.min.js", 
		
			"js/snippets.package.release.min.js", 
		
			"css/lib/prism-live.css", 
			"css/lib/prism.dark.min.css", 
			"css/lib/prism.min.css", 
		
			"css/snippets.package.min.css", 
		
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

		that
		.addEventListener(
			"install", 
			evt => {
		
				// console.log("sw install");
		
				evt
				.waitUntil(
					caches
					.open(this.cacheName)
					.then(
						cache => 
							cache
							.addAll(this.cacheFiles)
							.then(
								() => {
		
									// console.log("sw installed");
									
								}
							)
					)
					.catch(
						err => {
		
							// console.error("sw install fail", err);
		
						}
					),
				);
		
			}
		);

		that
		.addEventListener(
			"fetch", 
			evt => {
		
				let req = evt.request;
		
				// console.log("sw fetch", req.url);
		
				if(!req.url.startsWith("http")) 
					return;

				evt
				.respondWith(
					() => 
						caches
						.match(req)
						.then(
							matched => {
				
								if(matched) 
									return matched;
								else {

									console.log("sw load", req.url);
					
									return fetch(req)
									.then(
										res => {

											console.log("sw keep", req.url);

											return caches
											.open(this.cacheStorage)
											.then(
												cache => {

													cache
													.put(
														req, 
														res
														.clone()
													);
													
													return res;

												}
											)

										}
									);

								}
				
							}
						)
				);
				
			}
		);

	}

}

new SnippetsService(self);