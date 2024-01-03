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

		// hell yeah
		this.ohYes = "yes";

		// body and soul
		this.spirit = ["body", "console"];

		// snippet cmds
		this.cmd = ["del-" + this.ohYes, "del-no", "delete"];

		// default run options
		this.run = {
			"name": this.vanilla, 
			"type": "run", 
			"height": "18", 
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
		this.btn = this.createDiv(this.header, "menubtn", "hide");

		// snippet output wrapper
		this.snip = this.createDiv(this.content, "wrap");

		// title
		this.snippet = document
		.createElement("input");

		this.snippet.placeholder = "title...";

		this.classIt(this.snippet, "title");

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

		this.spirit
		.forEach(
			b => 
				this.createDiv(this.opts, b, "opt")
		);

		// snippet cmds
		this.cmds = this.createDiv(null, "cmds");

		let del = this.createDiv(this.cmds, "cmd", "delete");
		this.createDiv(del, "del-space");
		this.createDiv(del, "cmd", "del-no");

		/*this.cmd
		.forEach(
			b => 
				this.createDiv(this.cmds, b, "cmd")
		);*/

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

		this.classIt(newDiv, ...c);

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
				this.classIs(evt.target, "opt") 
				&& this.optClick(evt.target)
		);

		this.cmds
		.addEventListener(
			"click", 
			evt => 
				this.classIs(evt.target, "cmd") 
				&& this.cmdClick(evt.target)
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

		// if(DEBUG) console.log(dat);

		document.title = 
		this.snippet.value = 
		dat["t"] || "untitled";

		this.running = {
			...this.run, 
			...JSON.parse(dat["r"] || "{}")
		};

		this.spirit
		.forEach(
			o => {

				let el = this.opts
				.querySelector("." + o);

				if(this.running[o]) 
					this.classIt(el, "on");
				else 
					this.classOut(el, "on");

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

		if(this.cur) {

			// saved snippet

			// append cmd menu
			this.content
			.appendChild(this.cmds);

			this.classOut(this.save, "no");

			// reset delete btn state
			this.deleteNo();

		}
		else {

			// unsaved snippet

			this.classIt(this.save, "no");

		}
		
	}

	clearIt() {

		// if(DEBUG) console.log("clear");

		if(this.cur) 
			this.cmds
			.remove();

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

		this.classIt(wrap, "code");

		this.content
		.appendChild(wrap);

		// code wrapper
		let pre = document
		.createElement("pre");
		
		// enable prism live && line numbers
		this.classIt(pre, "prism-live", "line-numbers");

		wrap
		.appendChild(pre);

		// code
		let code = document
		.createElement("code");
		
		this.classIt(code, "code", "language-" + lang);

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

		window
		.scroll(0, 0);

		this.snips[this.vanilla]
		._run();

	}

	optClick(btn) {

		let opt = this.spirit
		.find(
			o => 
				this.classIs(btn, o) 
		);

		// if(DEBUG) console.log("opt", opt);
		
		this.running[opt] = !this.running[opt];

		this.classUs(btn, "on");

		this.classUs(this.snips[this.vanilla].wrap, "snip-no" + opt);

	}

	cmdClick(btn) {

		let cmd = this.cmd
		.find(
			o => 
				this.classIs(btn, o) 
		);

		if(DEBUG) console.log("cmd", cmd);

		switch(cmd) {

			case "delete": 
				this.askDelete(btn);
				break;

			case "del-yes": 
				this.deleteIt();
				break;

			case "del-no": 
				this.deleteNo();
				break;

		}

	}

	toggleMenu() {

		[this.menu, this.btn]
		.forEach(
			e => 
				this.classUs(e, "hide")
		);

		return true;

	}

	// openMenu ?

	closeMenu() {

		[this.menu, this.btn]
		.forEach(
			e => 
				this.classIt(e, "hide")
		);

	}

	async menuClick(entry) {

		entry = entry.slice(entry.lastIndexOf("#") + 1);

		// if(DEBUG) console.log("menu", entry);

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

		this.closeMenu();

		this.clearIt();

		this.loadIt();

		this.setHash("");

	}

	async aboutIt() {

		this.closeMenu();

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

					// TODO FULLSCREEN
					// "f=1", 

					// TODO AUTORUN
					// "a=1", 
					
					// TODO LOAD SCRIPTS & STYLES

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

			// remove unsaved snippet tip
			this.classOut(this.save, "no");

			this.content
			.appendChild(this.cmds);

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

		this.flushStore();

		// reset delete btn state
		this.deleteNo();

		this.yes(
			this.save
		);

	}

	flushStore() {

		window.localStorage
		.setItem(
			"snippets", 
			JSON
			.stringify(
				this.store
			)
		);

	}

	askDelete(btn) {

		// if(DEBUG) console.log("ask delete");

		this.classIt(btn, "del-yes");

	}

	deleteIt() {

		// if(DEBUG) console.log("confirm delete");

		// delete from store list
		this.store
		.splice(
			this.store
			.findIndex(
				s => 
					s["i"] === this.cur
			), 
			1
		);

		this.flushStore();

		// delete menu entry
		this.list
		.querySelector("[href='#" + this.cur + "']").parentNode
		.remove();
				
		// delete from storage
		window.localStorage
		.removeItem(
			"snippet-" + this.cur
		);

		// reset delete btn state
		this.deleteNo();

		// create new snippet
		this.createIt();

	}

	deleteNo() {

		// if(DEBUG) console.log("cancel delete");

		this.classOut(document.querySelector(".cmd.delete"), "del-yes");

	}

	async copyIt() {

		await navigator.clipboard
		.writeText(
			location.origin + 
			location.pathname + 
			"#" + await this.dumpIt()
		);

		this.yes(this.copy);

	}

	yes(btn) {

		this.classIt(btn, this.ohYes);

		setTimeout(
			() => 
				this.classOut(btn, this.ohYes), 
			500
		);

	}

	classIs(el, cl) {

		return el.classList
		.contains(cl);

	}

	classIt(el, ...cl) {

		el.classList
		.add(...cl);

	}

	classOut(el, ...cl) {

		el.classList
		.remove(cl);

	}

	classUs(el, cl) {

		return el.classList
		.toggle(cl);

	}
	
}