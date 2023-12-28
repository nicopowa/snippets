window.addEventListener("load", event => new SnippetPlayground());

class SnippetPlayground {

	constructor() {

		// page content
		this.content = document.querySelector(".content");

		let metas = [
			'{"name": "html", "type": ""}', 
			'{"name": "css", "type": ""}', 
			'{"name": "js", "type": "run", "insert": true, "link": ["html", "css"]}'
		];

		let def = [

			'<div class="helloworld">helloworld</div>', 
			'.helloworld {\n\tcolor: #FF0000;\n}', 
			'console.log("helloworld");'

		];

		this.snips = {};

		this.snip = document.createElement("div");

		this.snip.classList
		.add("snippet-wrap");

		this.content
		.appendChild(this.snip);

		try {

			let hashParams = Object
			.fromEntries(
				new URLSearchParams(
					atob(
						location.hash
						.slice(1)
					)
				)
			);

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

			console.log(err);

		}

		document
		.querySelector(".header-content")
		.addEventListener(
			"click", 
			() => {

				let str = btoa(
					["html", "css", "js"]
					.map(
						l => 
							l + "=" + this.snips[l].contents
					)
					.join("&")
				);

				// console.log(str);

				location.hash = str;

			}
		);

	}

	bloc(lang, metas, content) {

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

		let prism = new Prism.Live(pre);

		this.snips[lang] = new Snippet(code);

		if(this.snips[lang].element) {

			this.snip.appendChild(this.snips[lang].element);

			// bloc.parentNode.parentNode.parentNode.parentNode
			// .appendChild(wrap);

		}

	}
	
}