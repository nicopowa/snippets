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

		// snippet tools
		this.tools = document.createElement("div");

		this.tools.classList
		.add("snippet-tools");

		this.content
		.appendChild(this.tools);

		// save link
		this.save = document.createElement("div");

		this.save.classList
		.add("snippet-save");

		this.tools
		.appendChild(this.save);

		this.save
		.addEventListener(
			"click", 
			() => 
				this.saveIt()
		);

		// share link
		this.share = document.createElement("div");

		this.share.classList
		.add("snippet-share");

		this.tools
		.appendChild(this.share);

		this.share
		.addEventListener(
			"click", 
			() => 
				this.shareIt()
		);

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

		document
		.addEventListener(
			"keydown", 
			evt => {

				if(evt.ctrlKey && evt.key === "s") {

					evt
					.preventDefault();
					
					this.saveIt();

				}

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
		
		// enable prism live && line numbers
		pre.classList
		.add(
			"prism-live", 
			"line-numbers"
		);

		wrap
		.appendChild(pre);

		// code
		let code = document.createElement("code");

		code.classList
		.add(
			"code", 
			"language-" + lang
		);

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

	hashIt() {

		location.hash = btoa(
			["html", "css", "js"]
			.map(
				l => 
					l + "=" + encodeURIComponent(this.prisms[l].textarea.value)
			)
			.join("&")
		);

	}

	saveIt() {

		this.hashIt();

		this.feedback(this.save, "saved")

	}

	shareIt() {

		this.hashIt();

		navigator.clipboard
		.writeText(location.href)
		.then(
			() => 
				this.feedback(this.share, "shared")
		)
		.catch(
			err => {

				// scary red font

			}
		);

	}

	feedback(btn, clazz) {

		btn.classList
		.toggle(clazz);

		setTimeout(
			() => 
				btn.classList
				.toggle(clazz), 
			750
		);

	}
	
}