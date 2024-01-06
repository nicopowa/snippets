window
.addEventListener(
	"load", 
	() => 
		new SnippetPlayground()
);

class SnippetPlayground {

	// RTC SHARING
	// OPEN LOCAL FILESYSTEM DIRECTORY & RUN INDEX + CSS + JS

	// HASH CHANGE IF CLICKED LINK FROM OUTSIDE TO SAFARI ON IOS ??

	constructor() {

		this._name = "snippets";

		// 💻 🍦 🌈
		this.vanilla = "js";

		this.looks = "css";

		// talk to me
		this.langs = ["md", "html", this.looks, this.vanilla];

		// hell yeah
		this.ohYes = "yes";

		// snippet cmds
		this.cmd = [
			"del-" + this.ohYes, 
			"del-no", 
			"delete"
		];

		// default run options
		this.run = {
			"name": this.vanilla, 
			"type": "run", 
			"height": 18, 
			"body": true, 
			"console": true, 
			"insert": false, 
			[this.vanilla]: [], 
			[this.looks]: [], 
			"link": this.langs.slice(1, -1)
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
		this.snippets = [];

		// Libs data urls
		this.libsData = {};

		// page header
		this.header = this.getIt(".header");

		// page content
		this.content = this.getIt(".content");

		// page menu
		this.menu = this.getIt(".menu");

		// menu tools
		this.tools = this.getIt(".menutools");

		// more tools
		this.more = this.getIt(".moretools");

		// menu list
		this.list = this.getIt(".menulist");

		// libs list
		this.libs = this.getIt(".libslist");

		// menu btn
		this.btn = this.makeDiv(
			this.header, 
			"menubtn", 
			"hide"
		);

		// snippet output wrapper
		this.snip = this.makeDiv(
			this.content, 
			"wrap"
		);

		// title
		this.snippet = this.makeIt(
			this.header, 
			"input", 
			"", 
			"snip-title"
		);

		this.snippet.placeholder = "title...";

		// save link
		this.save = this.makeDiv(
			this.header, 
			"save"
		);

		// copy link
		this.copy = this.makeDiv(
			this.header, 
			"copy"
		);

		// create link
		this.make = this.makeDiv(
			this.tools, 
			"create"
		);

		// lib link
		this.lib = this.makeDiv(
			this.tools, 
			"lib"
		);

		// about link
		this.about = this.makeDiv(
			this.tools, 
			"about"
		);

		// export link
		this.down = this.makeDiv(
			this.more, 
			"down"
		);

		// import link
		this.up = this.makeDiv(
			this.more, 
			"up"
		);

		// snippet cmds
		this.cmds = this.makeDiv(
			null, 
			"cmds"
		);

		// delete snippet
		let del = this.makeDiv(
			this.cmds, 
			"cmd", 
			"delete"
		);

		// delete space confirm ___ cancel
		this.makeDiv(
			del, 
			"del-space"
		);

		// delete cancel
		this.makeDiv(
			del, 
			"cmd", 
			"del-no"
		);

		this.addListeners();

		this.liftOff();

	}

	async liftOff() {

		await this.loadLibs();

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

	async loadLibs() {

		this.libsData = /** @type {!Object} */(
			await (
				await fetch("libs.json")
			)
			.json()
		);

		// libs list
		Object
		.keys(this.libsData)
		.forEach(
			lib => 
				this.makeIt(
					this.libs, 
					"li", 
					lib, 
					lib
				)
		);

	}

	addListeners() {

		this.hearIt(
			this.btn, 
			this.toggleMenu
		);

		this.hearIt(
			this.menu, 
			evt => 
				// check is menu link
				evt.target.nodeName === "A" 
				// close menu after link click
				&& this.toggleMenu() 
				// menu callback
				&& this.menuClick(evt.target.href)
		);

		this.hearIt(
			this.libs,  
			evt => 
				// check is lib link
				evt.target.nodeName === "LI" 
				// menu callback
				&& this.libClick(evt.target)
		);

		this.hearIt(
			this.cmds,  
			evt => 
				this.classIs(evt.target, "cmd") 
				&& this.cmdClick(evt.target)
		);

		new Map([
			[this.make, this.createIt], 
			[this.lib, this.toggleLibs], 
			[this.about, this.aboutIt], 
			[this.save, this.saveIt], 
			[this.copy, this.copyIt], 
			[this.down, this.exportIt], 
			[this.up, this.importIt], 
		])
		.forEach(
			(cb, btn) => 
				this.hearIt(
					btn, 
					cb
				)
		);

		this.hearIt(
			document, 
			evt => 
				this.handleKeyDown(
					/** @type {KeyboardEvent} */
					(evt)
				), 
			"keydown"
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

	/**
	 * @method handleKeyDown : keyboard shortcuts
	 * @param {KeyboardEvent} evt : 
	 */
	handleKeyDown(evt) {

		if(
			(evt.ctrlKey || evt.metaKey) 
			&& "rs".includes(evt.key)
		) {

			evt
			.preventDefault();

			if(evt.key === "s") 
				// keyboard save
				this.saveIt();
			else if(evt.key === "r") 
				// keyboard run
				this.runIt();

		}

	}

	async parseMenuHash(h) {

		if(
			this.snippets
			.some(
				s => 
					s["i"] === h
			)
		) {

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

		if(DEBUG) console.log("load\n", dat);

		document.title = 
		this.snippet.value = 
		dat["t"] || "untitled";

		this.running = {
			...this.run, 
			...JSON
			.parse(
				dat["r"] 
				|| "{}"
			)
		};

		if(DEBUG) 
			console.log("run", this.running);

		// static HTML & CSS
		this.langs
		.slice(0, -1)
		.forEach(
			lang => 
				this.bloc(
					lang, 
					{
						"name": lang, 
						"type": ""
					}, 
					dat[lang] || ""
				)
		);

		// run JS
		this.bloc(
			this.vanilla, 
			this.running, 
			dat[this.vanilla] || ""
		);

		this.setLibs(
			JSON
			.parse(
				dat["l"] 
				|| "[]"
			)
		);

		this.injectLibs();

		this.snip
		.appendChild(
			this.snips[this.vanilla].wrap
		);

		if(this.cur) {

			// saved snippet

			// append cmd menu
			this.content
			.appendChild(this.cmds);

			this.classOut(
				this.save, 
				"no"
			);

			// reset delete btn state
			this.deleteNo();

		}
		else {

			// unsaved snippet

			this.classIt(
				this.save, 
				"no"
			);

		}

		this.runIt();
		
	}

	clearIt() {

		// if(DEBUG) console.log("clear");

		if(this.cur) 
			this.cmds
			.remove();

		this.cur = "";

		this.langs
		.forEach(
			lang => {

				if(DEBUG) console.log("remove", lang);

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
	 * @param {Object} metas : lang meta 
	 * @param {string} content : code source
	 */
	bloc(lang, metas, content) {

		// code bloc wrap
		let wrap = this.makeDiv(
			this.content, 
			"code"
		);

		// lang indicator
		this.makeIt(
			wrap, 
			"div", 
			lang, 
			"lang"
		);

		// code wrapper
		let pre = this.makeIt(
			wrap, 
			"pre", 
			"", 
			"prism-live", 
			"line-numbers"
		);

		// code
		let codeBloc = this.makeIt(
			pre, 
			"code", 
			"", 
			"code", 
			"language-" + lang
		);

		codeBloc
		.setAttribute(
			"data-snip", 
			encodeURI(
				JSON
				.stringify(metas)
			)
		);

		codeBloc.textContent = content;

		// keep bloc
		this.codes[lang] = wrap;

		// init Prism
		let prismed = new Prism
		.Live(pre);

		this.prisms[lang] = prismed;

		// init Snippet
		this.snips[lang] = new Snippet(codeBloc);

	}

	runIt() {

		window
		.scroll(
			0, 0
		);

		this.snips[this.vanilla]
		._run();

	}

	cmdClick(btn) {

		let cmd = this.cmd
		.find(
			o => 
				this.classIs(btn, o) 
		);

		// if(DEBUG) console.log("cmd", cmd);

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

		if(this.classIs(this.menu, "hide")) 
			this.openMenu();
		else 
			this.closeMenu();

		return true;

	}

	openMenu() {

		[this.menu, this.btn]
		.forEach(
			e => 
				this.classOut(
					e, 
					"hide"
				)
		);

	}

	closeMenu() {

		this.closeLibs();

		[this.menu, this.btn]
		.forEach(
			e => 
				this.classIt(
					e, 
					"hide"
				)
		);

	}

	async menuClick(entry) {

		entry = entry
		.slice(
			entry
			.lastIndexOf("#") 
			+ 1
		);

		// if(DEBUG) console.log("menu", entry);

		this.clearIt();

		this.loadIt(
			await this.parseMenuHash(entry)
		);

	}

	libClick(lib) {

		// if(DEBUG) console.log("lib", lib.innerHTML);

		this.classUs(
			lib, 
			"on"
		);

		this.injectLibs();

	}

	setLibs(libs) {

		if(DEBUG) console.log("set libs", libs);

		Object
		.keys(this.libsData)
		.forEach(
			lib => {

				let libItem = this.getIt("." + lib, this.libs);

				if(libs.includes(lib)) 
					this.classIt(
						libItem, 
						"on"
					);
				else 
					this.classOut(
						libItem, 
						"on"
					);


			}
			
		);

	}

	getLibs() {

		return Array
		.from(
			this.libs
			.querySelectorAll(".on")
		)
		.map(
			l => 
				l.innerHTML
		);

	}

	injectLibs() {

		let injection = this.libsUrls(
			this.getLibs()
		);

		this.snips[this.vanilla].codes = injection[this.vanilla];

		this.snips[this.vanilla].sheets = injection[this.looks];

		// set meta snip-data ?

	}

	libsUrls(libs) {

		if(DEBUG) console.log("libs", libs);

		return libs
		.reduce(
			(libsFiles, l) => {

				let libData = this.libsData[l];

				libsFiles[this.vanilla]
				.push(
					...libData[this.vanilla]
					.map(
						u => 
							libData["url"] + u
					)
				);

				libsFiles[this.looks]
				.push(
					...libData[this.looks]
					.map(
						u => 
							libData["url"] + u
					)
				);

				return libsFiles;

			},
			{
				[this.vanilla]: [], 
				[this.looks]: []
			}
		);

	}

	menuEntry(entry) {

		// create menu entry
		let menuEl = this.makeIt(
			this.list, 
			"li", 
			""
		);

		// create entry link
		let link = this.makeIt(
			menuEl, 
			"a", 
			entry["t"]
		);

		// link anchor
		link
		.setAttribute(
			"href", 
			"#" + entry["i"]
		);

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

	toggleLibs() {

		if(this.classIs(this.lib, "may")) 
			this.closeLibs();
		else 
			this.openLibs();

	}

	openLibs() {

		this.classIt(
			this.lib, 
			"may"
		);

		this.classIt(
			this.list, 
			"hide"
		);

		this.classOut(
			this.libs, 
			"hide"
		);

	}

	closeLibs() {

		this.classOut(
			this.lib, 
			"may"
		);

		this.classOut(
			this.list, 
			"hide"
		);

		this.classIt(
			this.libs, 
			"hide"
		);

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

		let vanillaIceCream = this.snips[this.vanilla], 
			vanillaMeat = !this.classIs(vanillaIceCream.wrap, "snip-nobody"), 
			vanillaSoul = !this.classIs(vanillaIceCream.wrap, "snip-noconsole"), 
			vanillaSky = vanillaIceCream.size;

		return await this.compress(
			this.langs
			.map(
				l => 
					l + "=" + 
					encodeURIComponent(
						this.prisms[l].textarea.value
					)
			)
			.concat(
				[
					// custom params
					...addSome, 

					// title
					"t=" + encodeURIComponent(
						this.snippet.value
					), 

					// run settings
					"r=" + JSON
					.stringify({
						...this.running, 
						"height": vanillaSky, 
						"body": vanillaMeat, 
						"console": vanillaSoul, 
					}), 

					"l=" + JSON
					.stringify(
						this.getLibs()
					)

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

		history
		.replaceState(
			h, 
			"",  
			"#" + h
		);

	}

	listIt() {

		this.snippets = JSON
		.parse(
			window.localStorage
			.getItem(this._name) 
			|| "[]"
		);

		// if(DEBUG) console.log(this.snippets);

		this.snippets
		.forEach(
			snippet => 
				this.menuEntry(snippet)
		);

	}

	async saveIt() {

		if(!this.cur) {

			let newSnippet = {

				"i": Date
				.now()
				.toString(36), 

				"t": this.snippet.value

			};

			this.cur = newSnippet["i"];

			document.title = newSnippet["t"];

			this.snippets
			.push(newSnippet);

			this.menuEntry(newSnippet);

			// remove unsaved snippet tip
			this.classOut(
				this.save, 
				"no"
			);

			this.content
			.appendChild(this.cmds);

			this.setHash(newSnippet["i"]);

		}
		else {

			let storedSnippet = this.snippets
			.find(
				s => 
					s["i"] === this.cur
			);

			// update menu title
			if(storedSnippet) {

				storedSnippet["t"] = this.snippet.value;

				this.getIt(
					"[href='#" + this.cur + "']", 
					this.list
				).innerHTML = storedSnippet["t"];

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
			this._name, 
			JSON
			.stringify(
				this.snippets
			)
		);

	}

	askDelete(btn) {

		// if(DEBUG) console.log("ask del");

		this.classIt(
			btn, 
			"del-yes"
		);

	}

	deleteIt() {

		// if(DEBUG) console.log("confirm del");

		// delete from store list
		this.snippets
		.splice(
			this.snippets
			.findIndex(
				s => 
					s["i"] === this.cur
			), 
			1
		);

		this.flushStore();

		// delete menu entry
		this.getIt(
			"[href='#" + this.cur + "']", 
			this.list
		).parentNode
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

		// if(DEBUG) console.log("cancel del");

		this.classOut(
			this.getIt(
				".cmd.delete"
			), 
			"del-yes"
		);

	}

	async copyIt() {

		// create URL + hash snippet
		let shareURL = location.origin + 
		location.pathname + 
		"#" + await this.dumpIt();

		try {

			// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
			// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
			await navigator
			.share({

				title: this.snippet.value, 
				url: shareURL

			});

		}
		catch(err) {

			// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
			await navigator.clipboard
			.writeText(
				shareURL
			);

		}

		this.yes(this.copy);

	}

	exportIt() {

		if(DEBUG) console.log("export");

		let fullDump = this.snippets
		.reduce(
			(dumping, snippet) => {

				let snippetId = snippet["i"];

				dumping[snippetId] = window.localStorage
				.getItem("snippet-" + snippetId);

				return dumping;

			}, 
			{
				[this._name]: this.snippets
			}
		);

		let forceDl = document
		.createElement("a");

		forceDl
		.setAttribute(
			"href", 
			"data:application/json;charset=utf-8," + 
			encodeURIComponent(
				JSON
				.stringify(fullDump)
			)
		);

		forceDl
		.setAttribute(
			"download", 
			this._name + ".json"
		);

		forceDl.style.display = "none";

		document.body
		.appendChild(forceDl);

		forceDl
		.click();

		forceDl
		.remove();

		this.yes(
			this.down
		);

	}

	importIt() {

		if(DEBUG) console.log("import");

	}

	yes(btn) {

		this.classIt(
			btn, 
			this.ohYes
		);

		setTimeout(
			() => 
				this.classOut(
					btn, 
					this.ohYes
				), 
			750
		);

	}

	// UTILS

	makeDiv(par, ...cl) {

		return this.makeIt(
			par, 
			"div", 
			"", 
			...cl
		);

	}

	/**
	 * @method makeIt : fast createElement
	 * @param {Element} par : parent
	 * @param {string} el : element name
	 * @param {string} cnt : innerHTML
	 * @param {...string} cl : classes
	 */
	makeIt(par, el, cnt, ...cl) {

		let newEl = document
		.createElement(el);

		if(cnt) 
			newEl.innerHTML = cnt;

		this.classIt(
			newEl, 
			...cl
		);

		if(par) 
			par
			.appendChild(newEl);

		return newEl;

	}

	getIt(sel, par = document) {

		return par
		.querySelector(
			sel
		);

	}

	hearIt(el, cb, evtName = "click") {

		el
		.addEventListener(
			evtName, 
			evt => 
				cb
				.bind(this)(evt)
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
		.remove(...cl);

	}

	classUs(el, cl) {

		el.classList
		.toggle(cl);

	}
	
}