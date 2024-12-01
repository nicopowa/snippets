class SnippetsService {

	constructor(that) {

		this.cacheName = "snippets";

		this.cacheVersion = 1;

		this.cacheStorage = this.cacheName + "-" + this.cacheVersion;

		this.cacheFiles = [

			"/",
			"index.html", 
		
			"js/lib/editor.bundle.js",
		
			"js/snippets.package.release.min.js", 
	
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
		
							console.error("sw install fail", err);
		
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

				return evt
				.respondWith(
					caches
					.match(req)
					.then(
						matched => {

							if(matched !== undefined) 
								return matched;
							else {

								return fetch(req)
								.then(
									resp => {
										
										let keep = resp
										.clone();

										caches
										.open(this.cacheName)
										.then(
											cache => {

												cache
												.put(
													req, 
													keep
												);

											}
										);

										return resp;

									}
								)
								.catch(
									() => {
										
										return null;
										
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