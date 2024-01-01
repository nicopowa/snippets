window
.addEventListener(
	"load", 
	() => 
		new SnippetPlayground()
);

class SnippetPlayground {

	constructor() {

		// 💻 🍦 🌈
		this.vanilla = "js";

		// talk to me
		this.langs = ["html", "css", this.vanilla];

		// default run options
		this.run = {
			"name": this.vanilla, 
			"type": "run", 
			"height": "13", 
			"body": true, 
			"console": true, 
			"insert": false, 
			"js": [], 
			"css": [], 
			"link": ["html", "css"]
		};

		// current snippet
		this.cur = "";

		// current snippet run options
		this.running = {};

		// Code blocs
		this.codes = {};

		// Snippet instances
		this.snips = {};

		// Prism Live instances
		this.prisms = {};

		// Snippets store
		this.store = [];

		// page header
		this.header = document
		.querySelector(".header");

		// page content
		this.content = document
		.querySelector(".content");

		// page menu
		this.menu = document
		.querySelector(".menu");

		// menu tools
		this.tools = document
		.querySelector(".menutools");

		// menu list
		this.list = document
		.querySelector(".menulist");

		// menu btn
		this.btn = this.createDiv(this.header, "menubtn", "collapse");

		// snippet output wrapper
		this.snip = this.createDiv(this.content, "wrap");

		// title
		this.snippet = document
		.createElement("input");

		this.snippet.placeholder = "name...";

		this.snippet.classList
		.add("title");

		this.header
		.appendChild(this.snippet);

		// header space
		this.createDiv(this.header, "space");

		// save link
		this.save = this.createDiv(this.header, "save");

		// copy link
		this.copy = this.createDiv(this.header, "copy");

		// create link
		this.create = this.createDiv(this.tools, "create");

		// about link
		this.about = this.createDiv(this.tools, "about");

		// snippet options
		this.opts = this.createDiv(null, "opts");

		["body", "console"]
		.forEach(
			b => 
				this.createDiv(this.opts, b, "opt")
		);

		this.addListeners();

		this.start();

	}

	async start() {

		this.listIt();

		let hashed = location.hash
		.slice(1);

		// if(DEBUG) console.log("hash", hashed);

		let startCode = {};

		// local snippet hash
		if(hashed.length === 8) 
			startCode = await this.parseMenuHash(hashed);
		// url snippet hash
		else if(hashed.length > 8) 
			startCode = await this.parseCodeHash(hashed);

		this.loadIt(startCode);

	}

	/**
	 * @method createDiv : create div element shortcut
	 * @param {Element} par : parent element
	 * @param  {...string} c : classes
	 * @returns {Element} created div
	 */
	createDiv(par, ...c) {

		let newDiv = document
		.createElement("div");

		newDiv.classList
		.add(...c);

		if(par) 
			par
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
			evt => 
				// check is menu link
				evt.target.nodeName === "A" 
				// close menu after link click
				&& this.toggleMenu() 
				// menu callback
				&& this.menuClick(evt.target.href)
		);

		this.opts
		.addEventListener(
			"click", 
			evt => 
				evt.target.classList.contains("opt") 
				&& this.optClick(evt.target)
		);

		new Map([
			[this.create, this.createIt], 
			[this.about, this.aboutIt], 
			[this.save, this.saveIt], 
			[this.copy, this.copyIt]
		])
		.forEach(
			(cb, btn) => 
				btn
				.addEventListener(
					"click", 
					() => 
						cb.bind(this)()
				)
		);

		document
		.addEventListener(
			"keydown", 
			evt => 
				this.handleKeyDown(evt)
		);

		/*window
		.addEventListener(
			"popstate", 
			evt => {

				console.log("pop", evt);

			}
		);*/

		/*window
		.addEventListener(
			"hashchange", 
			evt => {

				console.log("hash", evt);

			}
		);*/

	}

	handleKeyDown(evt) {

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

	async parseMenuHash(h) {

		let isSnippet = this.store
		.find(
			s => 
				s["i"] === h
		);

		if(isSnippet) {

			// if(DEBUG) console.log("load from storage");

			this.cur = h;

			return await this.parseCodeHash(
				window.localStorage
				.getItem("snippet-" + h)
			);

		}

		return {};

	}

	async parseCodeHash(h) {

		try {

			// parse hash
			return Object
			.fromEntries(
				new URLSearchParams(
					await (
						this.decompress(
							h
						)
						.catch(
							() => 
								({})
						)
					)
				)
			);
		
		}
		catch(err) {

			// oops
			console.error(err);

			return {};

		}

	}

	/**
	 * @method loadIt : load code
	 * @param {!Object=} dat : 
	 */
	loadIt(dat = {}) {

		if(DEBUG) console.log(dat);

		document.title = 
		this.snippet.value = 
		dat["t"] || "untitled";

		this.running = {
			...this.run, 
			...JSON.parse(dat["r"] || "{}")
		};

		["body", "console"]
		.forEach(
			o => {

				if(this.running[o]) 
					this.opts
					.querySelector("." + o).classList
					.add("on");
				else 
					this.opts
					.querySelector("." + o).classList
					.remove("on");

			}
		);
			

		this.content
		.appendChild(this.opts);

		// static HTML & CSS
		["html", "css"]
		.forEach(
			lang => 
				this.bloc(
					lang, 
					JSON
					.stringify({
						"name": lang, 
						"type": ""
					}), 
					dat[lang] || ""
				)
		);

		// run JS
		this.bloc(
			this.vanilla, 
			JSON
			.stringify(
				this.running
			), 
			dat[this.vanilla] || ""
		);

		this.snip
		.appendChild(this.snips[this.vanilla].wrap);
		
	}

	clearIt() {

		// if(DEBUG) console.log("clear");

		this.cur = "";

		this.opts
		.remove();

		this.langs
		.forEach(
			lang => {

				console.log("remove", lang);

				Snippet
				.remove(
					this.snips[lang].id
				);

				// TODO CLEAN CLEAR PRISM LIVE !!
				this.prisms[lang] = null;

				this.codes[lang]
				.remove();

			}
		);

		this.snips = {};
		this.prisms = {};
		this.codes = {};

		// this.setHash("");

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
		.add("code");

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

		// keep bloc
		this.codes[lang] = wrap;

		// init Prism
		let prismed = new Prism
		.Live(pre);

		prismed.textarea.placeholder = lang;

		this.prisms[lang] = prismed;

		// init Snippet
		this.snips[lang] = new Snippet(code);

	}

	runIt() {

		this.content
		.scrollTo(0, 0);

		this.snips[this.vanilla]
		._run();

	}

	optClick(btn) {

		["body", "console"]
		.filter(
			o => 
				btn.classList
				.contains(o)
		)
		.forEach(
			o => {
				
				// if(DEBUG) console.log("toggle", o);

				this.running[o] = !this.running[o];

				btn.classList
				.toggle("on");

				// no need if/else classlist add/remove ?
				this.snips[this.vanilla].wrap.classList
				.toggle("snip-no" + o);

			}
		);

	}

	toggleMenu() {

		this.btn.classList
		.toggle("collapse");

		this.menu.classList
		.toggle("collapse");

		this.tools.classList
		.toggle("hide");

		this.list.classList
		.toggle("hide");

		return true;

	}

	async menuClick(entry) {

		entry = entry.slice(entry.lastIndexOf("#") + 1);

		if(DEBUG) 
			console.log("menu", entry);

		this.clearIt();

		this.loadIt(
			await this.parseMenuHash(entry)
		);

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
			"#" + entry["i"]
		);

		// link text
		link.innerHTML = entry["t"];

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

	createIt() {

		this.toggleMenu();

		this.clearIt();

		this.loadIt();

		this.setHash("");

	}

	async aboutIt() {

		this.toggleMenu();

		this.clearIt();

		// + mail contact code@snipp.et

		this.loadIt(
			await this.parseCodeHash(
				await (
					await fetch("about.snippet")
				)
				.text()
			)
		);

		this.setHash("");	

	}

	async dumpIt(addSome = []) {

		return await this.compress(
			this.langs
			.map(
				l => 
					l + "=" + encodeURIComponent(this.prisms[l].textarea.value)
			)
			.concat(
				[
					// custom params
					...addSome, 

					// title
					"t=" + encodeURIComponent(this.snippet.value), 

					// run settings
					// "run=" + '{"console": false, "height": 20}', 
					"r=" + JSON.stringify(this.running), 

					// TODO AUTORUN
					// "a=1", 
					
					// load scripts

				]
			)
			.join(
				"&"
			)
		);

	}

	setHash(h) {

		// CHROMIUM 121 HASH CHANGE CRASH AW SNAP ??

		// location.hash = h;

		// location.replace("#" + h); 

		history.replaceState(h, "",  "#" + h);

	}

	listIt() {

		this.store = JSON
		.parse(
			window.localStorage
			.getItem("snippets") 
			|| "[]"
		);

		// if(DEBUG) console.log(this.store);

		this.store
		.forEach(
			snippet => 
				this.menuEntry(snippet)
		);

	}

	async saveIt() {

		// ALL SNIPPETS EXPORT DUMP BTN ?

		if(!this.cur) {

			let newSnippet = {
				"i": Date.now().toString(36), 
				"t": this.snippet.value
			};

			this.cur = newSnippet["i"];

			document.title = newSnippet["t"];

			this.store
			.push(newSnippet);

			this.menuEntry(newSnippet);

			this.setHash(newSnippet["i"]);

		}
		else {

			let storedSnippet = this.store
			.find(
				s => 
					s["i"] === this.cur
			);

			// update menu title
			if(storedSnippet) {

				storedSnippet["t"] = this.snippet.value;

				let snippetEntry = this.list.querySelector("[href='#" + this.cur + "']");

				if(snippetEntry) 
					snippetEntry.innerHTML = storedSnippet["t"];

			}

		}

		window.localStorage
		.setItem(
			"snippet-" + this.cur, 
			await this.dumpIt([
				"i=" + this.cur
			])
		);

		window.localStorage
		.setItem(
			"snippets", 
			JSON
			.stringify(
				this.store
			)
		);

		this.yes(
			this.save
		);

	}

	deleteIt() {



	}

	async copyIt() {

		navigator.clipboard
		.writeText(
			location.origin + 
			location.pathname + 
			"#" + await this.dumpIt()
		)
		.then(
			() => 
				this.yes(
					this.copy
				)
		)
		.catch(
			err => {

				// scary red font

			}
		);

	}

	yes(btn) {

		let feed = "yes";

		btn.classList
		.toggle(feed);

		setTimeout(
			() => 
				btn.classList
				.toggle(feed), 
			500
		);

	}
	
}