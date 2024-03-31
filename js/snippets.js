window
.addEventListener(
	"load", 
	() => 
		new SnippetPlayground()
);

class SnippetPlayground {

	// RTC SHARING
	// QRCODE ?
	// OPEN LOCAL FILESYSTEM DIRECTORY & RUN INDEX + CSS + JS

	// HASH CHANGE IF CLICKED LINK FROM OUTSIDE TO SAFARI ON IOS
	// FIXED ?

	// OVERRIDE SNIPPET RUN TO INJECT LIBS
	// top-level @import inside markdown ?

	// RESOURCE INTEGRITY

	// DISPLAY ERRORS IN MD AREA ?

	// IMPORT MAPS
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap

	constructor() {

		this._name = "snippets";

		// mark down
		this.notes = "md";

		// mark up
		this.corpse = "html";

		// 💻 🍦 🌈
		this.vanilla = "js";

		// my eyes
		this.looks = "css";

		// talk to me
		this.langs = [
			this.notes, 
			this.corpse, 
			this.looks, 
			this.vanilla
		];

		// hell yeah
		this.ohYes = "yes";

		// hell no
		this.ohNo = "no";

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
			"link": this.langs
			.slice(1, -1)
		};

		// snippet id
		this.cur = "";

		// snippet version
		this.ver = 0;

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

		// about page
		this.readme = "H4sIAAAAAAAACo1VS08bMRD+L5Ymp4C2dlXaSDnAkrSqQKoI5YI4OLuTrIPtWdleHqr63yvbmwQoCdmT5/XNzDdjr6nHgyYYPQZRNhzExFvVtscYQJTAp0kFxSmIstP9sfgGotQKxMR1Fnjx4/ryAnhRzmbAi5+zHJjsr70tAS9kVVFnA/ASeJE0FdG9Qv9CU8sg59LjTqRUIwYf8RwCL3wghzXwQtkQETRVUs8CObmMKHMHfApiQm7r8vsqFt1I3/SZ8QGj2WOsrkg+oUng6KLpdTFJ2lAiykaAmFRkgyPte+7EPu6Ac4uPwDnwAsRpJMKhDDGhjElzizspAM69fMAcn/oqr2NHZ3EIsVtelJfnaznhZ/9DkNNc3wJfvQG+2gDnNTik4iaNa9tyr9jERsoddcvm9YD2QNadaV8i4lNLLmwh/XqWC6V3LxRwrknWL4GU+R9o4ci8D/XuOpg6rbcx0tYH7YSyHlPOWMjnYhVzNiG0PpU0jSmcPo7tTGMNx9GBrxvMDcQL+EGzb7JU/qM0yeNtnnzdD6WiclircBAJN9IqreWeh+SXU96k+r8AL9bShUrrPX+OZ4x36AYddTtRSk2+S9tXkmmVTrc/RX8nWu7hbyYTY8k1vxC9JqA0O8kYVN6P51THKDg5y5CtrGtll0caFyGv3Sc0IHorPaBbaHo8esq2RtU12o15QTYcLaRR+jnbDVnyrawwv2hbcR1RkSaXfYGLr+nrjSfng5UfD8JYzqkLAzf+w6w0yEZs5dmQhec2nl1n2ZA1qJZNYCPxbchiR2wUXIdDVpH1pJGNFlJ7HLK8aBtx5dno9m7IKt8ftLL3bHTL4v+HZf3d33/LjWAMkQYAAA==";

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

		// title input
		this.snippet = this.makeIt(
			this.header, 
			"input", 
			"", 
			"snippet-title"
		);

		this.snippet.placeholder = "title...";

		// 
		this.makeDiv(
			this.header, 
			"space"
		);

		// save link
		this.save = this.makeDiv(
			this.header, 
			"save"
		);

		// copy link
		this.copy = this.makeDiv(
			this.header, 
			navigator.canShare ? 
			"share" 
			: "copy"
		);

		// create link
		this.make = this.makeDiv(
			this.tools, 
			"create"
		);

		// about link
		this.about = this.makeIt(
			this.tools, 
			"a", 
			"", 
			"about"
		);

		// about anchor
		this.about
		.setAttribute(
			"href", 
			"#about"
		);

		// export link
		this.down = this.makeDiv(
			this.more, 
			"export"
		);

		// import link
		this.up = this.makeDiv(
			this.more, 
			"import"
		);

		// snippet cmds
		this.cmds = this.makeDiv(
			null, 
			"cmds"
		);

		// version number
		this.vno = this.makeDiv(
			this.cmds, 
			"version"
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

		this.listIt();

		this.addListeners();

		if(!DEBUG) 
			this.runService();

		this.getHash();

		// this.spoofMe();

	}

	/**
	 * @method addListeners : events incoming
	 */
	addListeners() {

		this.hearIt(
			this.btn, 
			this.toggleMenu
		);

		// no more listener, hash change trigger
		/*this.hearIt(
			this.menu, 
			evt => 
				// check is menu link
				evt.target.nodeName === "A" 
				// close menu after link click
				&& this.toggleMenu() 
				// menu callback
				&& this.menuClick(evt.target.href)
		);*/

		this.hearIt(
			this.cmds,  
			evt => 
				this.classIs(evt.target, "cmd") 
				&& this.cmdClick(evt.target)
		);

		new Map([
			[this.make, this.createIt], 
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

		// no need, handled by url hashes
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
		/*window
		.addEventListener(
			"popstate", 
			evt => {

				console.log("pop", evt);

			}
		);*/

		// https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
		window
		.addEventListener(
			"hashchange", 
			() => 
				this.getHash(), 
			false
		);

	}

	/**
	 * @method getHash : hash change event
	 */
	getHash() {

		this.closeMenu();

		this.clearIt();

		this.parseHash()
		.then(
			enterTheCode => 
				this.loadIt(enterTheCode)
		);

	}

	/**
	 * @method parseHash : parse url hash
	 */
	parseHash() {

		let hashed = location.hash
		.slice(1);

		if(DEBUG) console.log("hash", hashed);

		// about page
		if(hashed == "about") 
			return this.parseCodeHash(this.readme);
		// local snippet hash
		else if(hashed.length <= 20) 
			return this.parseMenuHash(hashed);
		// url snippet hash
		else 
			return this.parseCodeHash(hashed);

	}

	/**
	 * @method runService : run service worker
	 */
	runService() {

		if(DEBUG) 
			console.log("service worker");

		if("serviceWorker" in navigator) 
			navigator.serviceWorker
			.register("js/service.js");

	}

	/*spoofMe() {

		let noResult = "search";

		let fakeSearch = document
		.createElement("input");

		fakeSearch
		.setAttribute(
			"type", 
			noResult
		);

		this.sing(
			fakeSearch, 
			"label", 
			noResult
		);

		this.sing(
			fakeSearch, 
			"description", 
			noResult
		);

		fakeSearch.style.visibility = "hidden";

		document.body
		.appendChild(fakeSearch);

		let fakeTitle = document
		.createElement("h1");

		fakeTitle.innerHTML = document.title;

		fakeTitle.style.visibility = "hidden";

		document.body
		.appendChild(fakeTitle);

	}*/

	/**
	 * @method handleKeyDown : keyboard shortcuts
	 * @param {KeyboardEvent} evt : where is the key
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
				this.saveIt(evt);
			else if(evt.key === "r") 
				// keyboard run
				this.runIt();

		}

	}

	/**
	 * @method parseMenuHash : load code from localStorage
	 * @param {string} h : id hash
	 */
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
				|| ""
			);

		}

		return {};

	}

	/**
	 * @method parseCodeHash : load code from url hash
	 * @param {string} codeHash : code hash
	 */
	async parseCodeHash(codeHash) {

		try {

			let decompressed = await this.decompress(codeHash);

			// URI style
			if(decompressed.startsWith("md=")) 
				return Object
				.fromEntries(
					new URLSearchParams(decompressed)
				);
			// JSON style
			else 
				return JSON
				.parse(decompressed)
		
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

		// if(DEBUG) console.log("load\n", dat);

		this.topIt();

		let snippetTitle = dat["t"] || "untitled";

		document.title = 
		this.snippet.value = 
		snippetTitle;

		this.ver = dat["v"] || 0;

		this.running = {
			...this.run, 
			...(
				typeof dat["r"] === "string" ?
				JSON
				.parse(
					dat["r"] 
					|| "{}"
				)
				: dat["r"]
			)
		};

		if(DEBUG) console.log("load", snippetTitle, "v" + this.ver /*this.running*/);

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

		this.snip
		.appendChild(
			this.snips[this.vanilla].wrap
		);

		this.snips[this.vanilla].frame.title = this.snippet.value;

		// is local snippet
		if(this.cur) {

			// append cmd menu
			this.content
			.appendChild(this.cmds);

			// reset save btn state
			this.classOut(
				this.save, 
				this.ohNo
			);

			// reset delete btn state
			this.deleteNo();

		}
		// unsaved snippet
		else {

			// no data check
			if(!Object.keys(dat).length) {

				if(DEBUG) 
					console.log("no data");

				this.clearHash();

			}

			// set unsaved btn state
			this.classIt(
				this.save, 
				this.ohNo
			);

		}

		this.refreshIt();

		// check useful run
		let usefulRun = this.langs
		.slice(-3)
		.map(
			lang => 
				this.snips[lang].contents.length 
		)
		.some(
			len => 
				len > 0
		);

		if(usefulRun) 
			this.runIt();
		else if(DEBUG) 
			console.log("nothing to run");
		
	}

	/**
	 * @method clearIt : clear it
	 */
	clearIt() {

		// if(DEBUG) console.log("clear");

		if(this.cur) 
			this.cmds
			.remove();

		this.cur = "";

		// this.langs
		Object
		.keys(this.snips)
		.forEach(
			lang => {

				// if(DEBUG) console.log("remove", lang);

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

		// this.clearHash();

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

		// text area aria
		this.sing(
			prismed.textarea, 
			"label", 
			"code-" + lang
		);

		this.prisms[lang] = prismed;

		// init Snippet
		this.snips[lang] = new Snippet(codeBloc);

	}

	/**
	 * @method topIt : back to top
	 */
	topIt() {

		window
		.scroll(
			0, 0
		);

	}

	/**
	 * @method runIt : get that code running
	 */
	runIt() {

		this.topIt();

		this.injectLibs();

		this.snips[this.vanilla]
		._run();

	}

	/**
	 * @method cmdClick : clicked bottom toolbar btn
	 * @param {Element} btn : cmd btn
	 */
	cmdClick(btn) {

		let cmd = this.cmd
		.find(
			o => 
				this.classIs(
					btn, 
					o
				) 
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

	/**
	 * @method openMenu : come in
	 */
	openMenu() {

		[this.menu, this.btn]
		.forEach(
			el => 
				this.classOut(
					el, 
					"hide"
				)
		);

	}

	/**
	 * @method closeMenu : go away
	 */
	closeMenu() {

		[this.menu, this.btn]
		.forEach(
			el => 
				this.classIt(
					el, 
					"hide"
				)
		);

	}

	/**
	 * @method toggleMenu : come away
	 */
	toggleMenu() {

		if(this.classIs(this.menu, "hide")) 
			this.openMenu();
		else 
			this.closeMenu();

		// was inlined from event callback
		// return true;

	}

	// no more click listener
	// trust the hash
	/*async menuClick(entry) {

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

	}*/

	/**
	 * @method injectLibs : 
	 */
	injectLibs() {

		let injectWhat = {
			[this.vanilla]: [], 
			// "module": [], 
			// "importmap": [], 
			// "import": [], 
			[this.looks]: []
		};

		let injections = Object
		.keys(injectWhat)
		.reduce(
			(libs, ext) => {

				let reg = new RegExp(
					"^@(" + ext + ")\\s(.+)$", 
					"gm"
				);

				Array
				.from(
					this.prisms[this.notes].textarea.value
					.matchAll(reg)
				)
				.forEach(
					matched => 
						libs[matched[1]]
						.push(matched[2])
				);

				return libs;

			}, 

			injectWhat
			
		);

		// if(DEBUG) console.log("inject\n", injections);

		Object
		.assign(
			this.snips[this.vanilla], 
			{
				codes: injections[this.vanilla], 
				sheets: injections[this.looks]
			}
		);

		/*
		// was
		let vanillaSnip = this.snips[this.vanilla];
		vanillaSnip.codes = injections[this.vanilla];
		vanillaSnip.sheets = injections[this.looks];
		*/


		// USELESS OLDIES

		// if(injections["module"].length + injections["import"].length) vanillaSnip.module = true;

		// vanillaSnip.mods = injections["module"];

		// vanillaSnip.importMap = injections["importmap"];

		// vanillaSnip.imports = injections["import"];

		// set meta snip-data ?

	}

	/**
	 * @method menuEntry : create snippet menu entry
	 * @param {Object} entry : snippet data
	 */
	menuEntry(entry) {

		// create menu entry
		let menuEl = this.makeIt(
			this.list, 
			"li", 
			"", 
			"menuitem"
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

	/**
	 * @method compress : crush it
	 * @param {string} plainStr : 
	 */
	async compress(plainStr) {

		return btoa(
			new Uint8Array(
				await new Response(
					new Response(plainStr).body
					.pipeThrough(
						new CompressionStream(
							"gzip"
						)
					)
				)
				.arrayBuffer()
			)
			.reduce(
				(d, b) => 
					d + 
					String
					.fromCharCode(b), 
				""
			)
		);

		// String.fromCharCode max args length call stack
		/*return btoa(
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
		);*/

	}

	/**
	 * @method decompress : welcome back
	 * @param {string} b64Str : 
	 */
	async decompress(b64Str) {

		if(DEBUG) console.log("decompress", b64Str.length);

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
				new DecompressionStream(
					"gzip"
				)
			)
		)
		.text();

	}

	/**
	 * @method createIt : blank
	 */
	createIt() {

		this.closeMenu();

		this.clearIt();

		this.loadIt();

	}

	/**
	 * @method dumpIt : 
	 * @param {Object} moreProps 
	 */
	async dumpIt(moreProps = {}) {

		let vanillaIceCream = this.snips[this.vanilla], 
			vanillaWrap = vanillaIceCream.wrap, 
			vanillaEverything = JSON
			.stringify({
				// snippet codes
				...this.langs
				.reduce(
					(dumping, l) => ({
						...dumping, 
						[l]: this.prisms[l].textarea.value
					}), 
					{
						// snippet title
						"t": this.snippet.value, 
						// snippet settings
						"r": {
							...this.running, 
							// render height
							"height": vanillaIceCream.size, 
							// iframe state
							"body": !this.classIs(vanillaWrap, "noone"), 
							// console state
							"console": !this.classIs(vanillaWrap, "nolog")
						}, 
						// snippet id and version fropm arg
						...moreProps
					}
				)
			});

		// console.log(vanillaEverything);

		// OLD URLPARAMS DUMP

		/*let vanillaIceCream = this.snips[this.vanilla], 
			vanillaMeat = !this.classIs(vanillaIceCream.wrap, "noone"), 
			vanillaSoul = !this.classIs(vanillaIceCream.wrap, "nolog"), 
			vanillaSky = vanillaIceCream.size;

		let vanillaEverything = this.langs
		.map(
			l => 
				l + "=" + 
				// was encodeURIComponent
				this.prisms[l].textarea.value
		)
		.concat(
			[

				// custom params
				moreProps, 

				// title
				"t=" + 
				// was encodeURIComponent
				this.snippet.value, 

				// run settings
				"r=" + JSON
				.stringify({
					...this.running, 
					"height": vanillaSky, 
					"body": vanillaMeat, 
					"console": vanillaSoul, 
				})

			]
		)
		.join(
			"&"
		);

		// console.log(vanillaEverything);
		*/

		if(DEBUG) console.log("compress", vanillaEverything.length);

		let dumped = await this.compress(vanillaEverything);

		if(DEBUG) console.log("compressed", dumped.length);

		return dumped;

	}

	/**
	 * @method clearHash : empty hash
	 */
	clearHash() {

		if(DEBUG) 
			console.log("clear hash");

		history
		.pushState(
			"", 
			document.title, 
			window.location.pathname + window.location.search
		);

	}

	/**
	 * @method setHash : set page URL hash
	 * @param {string} h : 
	 */
	setHash(h) {

		if(DEBUG) 
			console.log("set hash", h);

		// CHROMIUM 121 HASH CHANGE CRASH AW SNAP ??

		history
		.replaceState(
			h, 
			"",  
			"#" + h
		);

	}

	/**
	 * @method listIt : menu entries
	 */
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

	/**
	 * @method refreshIt : update page title && version number display
	 */
	refreshIt() {

		document.title = this.snippet.value;

		// version int to xxx.x.x
		this.vno.innerHTML = "v" + 
		Math
		.floor(this.ver / 100) + 
		"." + 
		this.ver
		.toString()
		.padStart(3, "0")
		.slice(-2)
		.split("")
		.join(".");

	}

	/**
	 * @method saveIt : save snippet
	 * @param {MouseEvent|TouchEvent|KeyboardEvent} evt : 
	 */
	async saveIt(evt) {

		if(DEBUG) 
			console.log("save", evt.target);

		// first time
		if(!this.cur) {
			
			// gen id
			this.cur = Date
			.now()
			.toString(36) 
			+ Math
			.random()
			.toString(36)
			.slice(2);

			// v0
			this.ver = 0;

			// snippet object
			let newSnippet = {

				"i": this.cur, 
				"v": this.ver, 
				"t": this.snippet.value

			};

			// push to snippets
			this.snippets
			.push(newSnippet);

			// add menu entry
			this.menuEntry(newSnippet);

			// unsaved snippet tip
			this.classOut(
				this.save, 
				this.ohNo
			);

			// disp version and delete btn
			this.content
			.appendChild(this.cmds);

			// set id hash
			this.setHash(this.cur);

		}
		// next times
		else {

			// find snippet data
			let storedSnippet = this.snippets
			.find(
				s => 
					s["i"] === this.cur
			);

			// update menu title
			if(storedSnippet) {

				// next version
				this.ver++;

				// update title
				storedSnippet["t"] = this.snippet.value;

				// update version
				storedSnippet["v"] = this.ver;

				// update menu entry
				this.getIt(
					"[href='#" + this.cur + "']", 
					this.list
				)
				.innerHTML = storedSnippet["t"];

			}

		}

		// flush to local storage
		window.localStorage
		.setItem(
			"snippet-" + this.cur, 
			await this.dumpIt({
				"i": this.cur, 
				"v": this.ver
			})
		);

		// update snippets list
		this.flushStore();

		// refresh page title and version number
		this.refreshIt();

		// reset delete btn state
		this.deleteNo();

		// so satisfying
		this.yes(
			this.save
		);

	}

	/**
	 * @method flushStore : save snippets list to localStorage
	 */
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

	/**
	 * @method askDelete : are you sure ?
	 * @param {Element} btn : 
	 */
	askDelete(btn) {

		// if(DEBUG) console.log("ask del");

		this.classIt(
			btn, 
			"del-yes"
		);

	}

	/**
	 * @method deleteIt : trash it
	 */
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

	/**
	 * @method deleteNo : changed my mind
	 */
	deleteNo() {

		// if(DEBUG) console.log("cancel del");

		this.classOut(
			this.getIt(
				".cmd.delete"
			), 
			"del-yes"
		);

	}

	/**
	 * @method copyIt : export snippet to URL hash
	 * @suppress {deprecated}
	 */
	async copyIt() {

		// create URL + hash snippet
		let shareURL = location.origin + location.pathname 
		+ "#" + await this.dumpIt();

		if(navigator.canShare) {

			// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
			// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
			navigator
			.share({

				title: this.snippet.value, 
				url: shareURL

			});

		}
		else if(navigator.clipboard) {

			// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
			navigator.clipboard
			.writeText(
				shareURL
			)
			.then(
				() => 
					this.yes(this.copy)
			);

		}
		else {

			/*let forceCopy = document
			.createElement("textarea");

			forceCopy.value = shareURL;

			forceCopy.style.display = "none";

			document.body
			.appendChild(forceCopy);

			forceCopy
			.focus();

			forceCopy
			.select();

			try {

				document
				.execCommand("copy");

				this.yes(this.copy);

			}
			catch (err) {

				this.yes(this.copy, false);

			}

			document.body
			.removeChild(forceCopy);*/

		}

		
		/*.catch(
			err => {

				console.log(err);

				this.no()

			}
		);*/

	}

	/**
	 * @method exportIt : save snippets to file
	 */
	exportIt() {

		// if(DEBUG) console.log("export");

		let fullDump = this.snippets
		.reduce(
			(dumping, snippet) => {

				let snippetId = snippet["i"];

				dumping[snippetId] = window.localStorage
				.getItem("snippet-" + snippetId) 
				|| "";

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

	/**
	 * @method importIt : load snippets from file
	 */
	importIt() {

		// if(DEBUG) console.log("import");

		let fileBrowser = document
		.createElement("input");
	
		fileBrowser.type = "file";
		fileBrowser.accept = "application/json";

		fileBrowser.style.display = "none";

		document.body
		.appendChild(fileBrowser);

		fileBrowser
		.addEventListener(
			"change", 
			() => {

				if(fileBrowser.files.length) {

					let jsonFile = fileBrowser.files[0], 
						fileReader = new FileReader();

					fileReader
					.addEventListener(
						"loadend", 
						evt => {

							try {

								let parsed = JSON
								.parse(
									evt.target.result
								);

								// console.log(parsed);

								parsed["snippets"]
								.filter(
									snippet => 
										parsed[snippet["i"]]
								)
								.forEach(
									snippet => {

										if(DEBUG) 
											console.log(snippet);

										// check snippet id exists
										let hasSnippet = this.snippets
										.find(
											already => 
												already["i"] === snippet["i"]
										);

										// if exists check older version
										// and overwrite
										// confirm ?
										// keep both ?
										// rename previous version ?
										let inject = hasSnippet 
										&& hasSnippet["v"] > hasSnippet["v"] 
										|| !hasSnippet;

										if(inject) {
											
											// console.log("INJECT", snippet["i"]);

											window.localStorage
											.setItem(
												"snippet-" + snippet["i"], 
												parsed[snippet["i"]]
											);

											this.menuEntry(snippet);

											this.snippets
											.push(snippet);

											this.flushStore();

										}

									}
								);

							}
							catch(err) {

							}

						}
					);

					fileReader
					.readAsText(jsonFile);

				}

				fileBrowser
				.remove();

			}
		);

		fileBrowser
		.click();

	}

	/**
	 * @method yes : temp supergreen so satisfying
	 * @param {Element} el : 
	 * @param {!boolean=} indeed : false to say no
	 */
	yes(el, indeed = true) {

		let cl = indeed ? this.ohYes : this.ohNo;

		this.classIt(
			el, 
			cl
		);

		setTimeout(
			() => 
				this.classOut(
					el, 
					cl
				), 
			750
		);

	}

	// UTILS

	/**
	 * @method makeDiv : div factory
	 * @param {Element} par : parent element
	 * @param  {...string} cl : classes
	 */
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

		/*this.sing(
			newEl, 
			"label", 
			cl[0]
		);*/

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

	/**
	 * @method getIt : querySelector macro
	 * @param {string} sel : query
	 * @param {Element} par : parent
	 */
	getIt(sel, par = document.body) {

		return par
		.querySelector(
			sel
		);

	}

	/**
	 * @method hearIt : addEVentListener macro
	 * @param {Node|HTMLElement} el : 
	 * @param {Function} cb : 
	 * @param {!string=} evtName : 
	 */
	hearIt(el, cb, evtName = "click") {

		el
		.addEventListener(
			evtName, 
			evt => 
				cb
				.bind(this)(evt)
		);

	}

	/**
	 * @method classIs : has class macro
	 * @param {Element} el : 
	 * @param {string} cl : 
	 */
	classIs(el, cl) {

		return el.classList
		.contains(cl);

	}

	/**
	 * @method classIt : add class macro
	 * @param {Element} el : 
	 * @param {...string} cl : 
	 */
	classIt(el, ...cl) {

		el.classList
		.add(...cl);

	}

	/**
	 * @method classOut : remove class macro
	 * @param {Element} el : 
	 * @param {...string} cl : 
	 */
	classOut(el, ...cl) {

		el.classList
		.remove(...cl);

	}

	/**
	 * @method classUs : toggle class macro
	 * @param {Element} el : 
	 * @param {string} cl : 
	 */
	classUs(el, cl) {

		el.classList
		.toggle(cl);

	}

	/**
	 * @method sing : 100% supergreen confetti all over the place
	 * @param {Element} el : 
	 * @param {string} aria : aria field
	 * @param {string} tune : aria value
	 */
	sing(el, aria, tune) {

		el
		.setAttribute(
			"aria-" + aria, 
			tune
		);

	}
	
}