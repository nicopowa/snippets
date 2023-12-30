window
.addEventListener(
	"load", 
	() => 
		new SnippetPlayground()
);

class SnippetPlayground {

	constructor() {

		// Snippet instances
		this.snips = {};

		// Prism Live instances
		this.prisms = {};

		// page header
		this.header = document
		.querySelector(".header");

		// page content
		this.content = document
		.querySelector(".content");

		// page menu
		this.menu = document
		.querySelector(".menu");

		// menu list
		this.list = document
		.querySelector(".menulist");

		// menu btn
		this.btn = this.createDiv(this.header, "menubtn", "collapse");

		// snippet output wrapper
		this.snip = this.createDiv(this.content, "snippet-wrap");

		// title
		this.snippet = document
		.createElement("input");

		this.snippet.classList
		.add("snippet-title");

		this.header
		.appendChild(this.snippet);

		// header space
		this.createDiv(this.header, "space");

		// tools
		this.tools = this.createDiv(this.header, "snippet-tools");

		// save link
		this.save = this.createDiv(this.tools, "snippet-save");

		// copy link
		this.copy = this.createDiv(this.tools, "snippet-copy");

		this.menuEntry("about");

		this.addListeners();

		this.loadCode();

	}

	createDiv(p, ...c) {

		let newDiv = document.createElement("div");

		newDiv.classList
		.add(...c);

		p
		.appendChild(newDiv);

		return newDiv;

	}

	addListeners() {

		this.btn
		.addEventListener(
			"click", 
			() => 
				this.toggleMenu()
		);

		this.menu
		.addEventListener(
			"click", 
			// close menu after link click
			evt => 
				evt.target.nodeName === "A" 
				&& this.toggleMenu() 
				&& this.menuClick(evt.target.href)
		);

		this.save
		.addEventListener(
			"click", 
			() => 
				this.saveIt()
		);

		this.copy
		.addEventListener(
			"click", 
			() => 
				this.copyIt()
		);

		document
		.addEventListener(
			"keydown", 
			evt => {

				if(
					(evt.ctrlKey || evt.metaKey) 
					&& "rs".includes(evt.key)
				) {

					evt
					.preventDefault();

					if(evt.key === "s") 
						this.saveIt();
					else if(evt.key === "r") 
						this.runIt();

				}

			}
		);

	}

	async loadCode() {

		// code blocs headers
		let metas = [
			{
				"name": "html", 
				"type": ""
			}, 
			{
				"name": "css", 
				"type": ""
			}, 
			{
				"name": "js", 
				"type": "run", 
				"height": "13", 
				"insert": false, 
				"link": ["html", "css"]
			}
		];

		// default codes
		let def = [

			'<div class="helloworld">helloworld</div>', 
			'.helloworld {\n\tcolor: #0077FF;\n}', 
			'console.log("helloworld");'

		];

		// parse hash string
		try {

			// get hash
			let hashed = location.hash
			.slice(1);

			// parse hash
			let hashParams = new URLSearchParams(
				await (
					this.decompress(
						hashed
					)
					.catch(
						() => 
							({})
					)
				)
			);

			// console.log(hashParams);

			// if(hashParams.has("t")) 
			this.snippet.value = hashParams.get("t") || "snippet";

			// get codes
			["html", "css", "js"]
			.forEach(
				(lang, langIndex) => 
					this.bloc(
						lang, 
						JSON
						.stringify(
							metas[langIndex]
						), 
						hashParams
						.has(lang) 
						&& hashParams.get(lang) 
						|| def[langIndex]
					)
			);

		}
		catch(err) {

			// oops
			console.error(err);

		}

	}

	/**
	 * @method bloc : code bloc
	 * @param {string} lang : bloc lang
	 * @param {string} metas : lang meta 
	 * @param {string} content : code source
	 */
	bloc(lang, metas, content) {

		// code bloc wrap
		let wrap = document
		.createElement("div");

		wrap.classList
		.add("code-wrap");

		this.content
		.appendChild(wrap);

		// code wrapper
		let pre = document
		.createElement("pre");
		
		// enable prism live && line numbers
		pre.classList
		.add(
			"prism-live", 
			"line-numbers"
		);

		wrap
		.appendChild(pre);

		// code
		let code = document
		.createElement("code");

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

		// init Prism
		this.prisms[lang] = new Prism
		.Live(pre);

		// init Snippet
		this.snips[lang] = new Snippet(code);

		// append Snippet
		if(this.snips[lang].element) 
			this.snip
			.appendChild(this.snips[lang].element);

	}

	runIt() {

		this.snips["js"]
		._run();

	}

	toggleMenu() {

		this.btn.classList
		.toggle("collapse");

		this.menu.classList
		.toggle("collapse");

		this.list.classList
		.toggle("hide");

		return true;

	}

	menuClick(entry) {

		entry = entry.slice(entry.lastIndexOf("#") + 1);

		console.log("menu", entry);

	}

	menuEntry(entry) {

		// create menu entry
		let el = document
		.createElement("li");

		// add to menu
		this.list
		.appendChild(el);

		// create entry link
		let link = document
		.createElement("a");

		// link anchor
		link
		.setAttribute(
			"href", 
			"#" + entry
		);

		// link text
		link.innerHTML = entry;

		// add to entry
		el
		.appendChild(link);

	}

	async compress(plainStr) {

		return btoa(
			String
			.fromCharCode(
				...new Uint8Array(
					await new Response(
						new Response(plainStr).body
						.pipeThrough(
							new CompressionStream("gzip")
						)
					)
					.arrayBuffer()
				)
			)
		);

	}

	async decompress(b64Str) {

		return await new Response(
			new Response(
				Uint8Array
				.from(
					atob(b64Str), 
					c => 
						c
						.charCodeAt(0)
				)
			).body
			.pipeThrough(
				new DecompressionStream("gzip")
			)
		)
		.text();

	}

	async dumpIt() {

		return await this.compress(
			[
				"html", 
				"css", 
				"js"
			]
			.map(
				l => 
					l + "=" + encodeURIComponent(this.prisms[l].textarea.value)
			)
			.concat(
				[
					"t=" + encodeURIComponent(this.snippet.value), 
					// more info
					// snippet run options
					// load scripts
				]
			)
			.join(
				"&"
			)
		);

	}

	async hashIt() {

		location.hash = await this.dumpIt();

	}

	async saveIt() {

		// TODO ID && SAVE TO LOCAL STORAGE
		// DROP DOWN LOCAL SNIPPETS
		// ALL SNIPPETS EXPORT DUMP BTN ?

		await this.hashIt();

		this.feedback(
			this.save, 
			"saved"
		);

	}

	async copyIt() {

		await this.hashIt();

		navigator.clipboard
		.writeText(location.href)
		.then(
			() => 
				this.feedback(
					this.copy, 
					"copied"
				)
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
			500
		);

	}
	
}