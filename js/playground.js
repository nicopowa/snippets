window
.addEventListener(
	"load", 
	() => 
		new SnippetPlayground()
);

class SnippetPlayground {

	constructor() {

		// page content
		this.content = document.querySelector(".content");

		// code blocs headers
		let metas = [
			'{"name": "html", "type": ""}', 
			'{"name": "css", "type": ""}', 
			'{"name": "js", "type": "run", "height": "13", "insert": false, "link": ["html", "css"]}'
		];

		// default codes
		let def = [

			'<div class="helloworld">helloworld 🌈</div>', 
			'.helloworld {\n\tcolor: #0077FF;\n}', 
			'console.log("helloworld 🌈");'

		];

		// Snippet instances
		this.snips = {};

		// Prism Live instances
		this.prisms = {};

		// snippet output wrapper
		this.snip = document.createElement("div");

		this.snip.classList
		.add("snippet-wrap");

		this.content
		.appendChild(this.snip);

		// parse hash string
		try {

			// get hash
			let hashed = location.hash
			.slice(1);

			// parse hash
			let hashParams = Object
			.fromEntries(
				new URLSearchParams(
					atob(
						hashed
					)
				)
			);

			// get codes
			["html", "css", "js"]
			.forEach(
				(lang, langIndex) => 
					this.bloc(
						lang, 
						metas[langIndex], 
						hashParams
						.hasOwnProperty(lang) 
						&& hashParams[lang] 
						|| def[langIndex]
					)
			);

		}
		catch(err) {

			// oops
			console.error(err);

		}

		// save
		document
		.querySelector(".header-content")
		.addEventListener(
			"click", 
			() => {

				location.hash = btoa(
					["html", "css", "js"]
					.map(
						l => 
							l + "=" + encodeURIComponent(this.prisms[l].textarea.value)
					)
					.join("&")
				);

			}
		);

	}

	/**
	 * @method bloc : code bloc
	 * @param {string} lang : bloc lang
	 * @param {string} metas : lang meta 
	 * @param {string} content : code source
	 */
	bloc(lang, metas, content) {

		// code bloc wrap
		let wrap = document.createElement("div");

		wrap.classList
		.add("code-wrap");

		this.content
		.appendChild(wrap);

		// code wrapper
		let pre = document.createElement("pre");
		
		// enable prism live
		pre.classList
		.add("prism-live");

		// enable prism line numbers
		pre.classList
		.add("line-numbers");

		pre.classList
		.add("editor");

		wrap
		.appendChild(pre);

		// code
		let code = document.createElement("code");

		code.classList
		.add("code");

		code.classList
		.add("language-" + lang);

		code
		.setAttribute(
			"data-snip", 
			encodeURI(metas)
		);

		code.textContent = content;

		pre
		.appendChild(code);

		this.prisms[lang] = new Prism.Live(pre);

		this.snips[lang] = new Snippet(code);

		if(this.snips[lang].element) 
			this.snip
			.appendChild(this.snips[lang].element);

	}
	
}