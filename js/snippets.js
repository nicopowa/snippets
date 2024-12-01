class Snippets {

	// rtc sharing
	// qrcode ?
	// open local filesystem directory & run index + css + js

	// hash change if clicked link from outside to safari on ios
	// fixed ?

	// keep +lang btns all blocs to insert new blocs between

	// override snippet run to inject libs
	// top-level @import inside markdown ?

	// monitor editors changes and no up version if none
	// allow save change title or settings

	// resource integrity

	// display errors in md area ?

	// keep version + date ?

	// ctrl+z scroll to cursor

	// multiple js snippets && link
	// done
	// add btns new bloc and delete + confirm

	// kill screen edges history
	// https://pqina.nl/blog/blocking-navigation-gestures-on-ios-13-4/

	// import maps
	// https://developer.mozilla.org/en-us/docs/web/html/element/script/type/importmap

	// set unsaved state store version on save, compare codemirror doc text
	// https://codemirror.net/docs/ref/#state.text.eq

	// drop files or text selection
	// md html css js files auto create bloc

	// all cmd btns wraps factory cmd make wrap then real btn cmd

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

		// module
		this.mod = "module";

		// import
		this.imp = "import";

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
		this.cmd = {

			"ttl": this.nameIt, 
			"sav": this.saveIt, 
			"snd": this.copyIt, 
			"new": this.createIt, 
			"abt": this.aboutIt, 
			"dmp": this.exportIt, 
			"imp": this.importIt, 

			"nnm": this.codeName, 
			"tog": this.toggleCode, 
			"add": this.addCode, 

			"rem-ask": this.askRemove, 
			["rem-" + this.ohYes]: this.removeIt, 
			["rem-" + this.ohNo]: this.removeNo, 
			
			"del-ask": this.askDelete, 
			["del-" + this.ohYes]: this.deleteIt, 
			["del-" + this.ohNo]: this.deleteNo, 

			"pin": this.pinUp, 
			"ver": this.verNo
			
		};

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
			// TODO LINK NEW BLOCKS
			/*"link": this.langs
			.slice(1, -1)*/
		};

		// snippet id
		this.cur = "";

		// snippet version
		this.ver = 0;

		// current snippet run options
		this.running = {};

		// code blocs props
		this.metas = {};

		// code blocs
		this.codes = {};

		// snippet instances
		this.snips = {};

		// editor instances
		this.edits = {};

		// snippets store
		this.snippets = [];

		if(
			window.matchMedia("(display-mode: standalone)").matches 
			|| window.navigator["standalone"]
		) {

			this.classIt(
				document.body, 
				"stand"
			);

		}

		// page header
		this.header = this.getIt(".header");

		// page content
		this.content = this.getIt(".content");

		// page menu
		this.menu = this.getIt(".menu");

		// menu tools
		this.tools = this.getIt(".menutools");

		// menu filter
		this.look = this.getIt(".menulook");

		this.look.placeholder = "search...";

		// menu list wrap
		this.lists = this.getIt(".menulists");

		// menu list
		this.list = this.getIt(".menulist");

		// menu btn
		this.btn = this.makeDiv(
			this.header, 
			"menubtn", 
			"none"
		);

		// close btn
		this.cbtn = this.makeDiv(
			this.tools, 
			"closebtn"
		);

		// menu mask
		this.mmsk = this.getIt(".menumask");

		// title input
		/*this.snippet = this.makeIt(
			this.header, 
			"input", 
			"", 
			"snippet-title"
		);*/

		this.snippet = this.makeDiv(
			this.header, 
			"cmd", 
			"ttl"
		);

		// space please
		this.makeDiv(
			this.header, 
			"spc"
		);

		// save snippet
		this.save = this.makeDiv(
			this.header, 
			"cmd", 
			"sav"
		);

		// share snippet
		this.copy = this.makeDiv(
			this.header, 
			"cmd", 
			"snd"
		);

		// snippet output wrapper
		this.snip = this.makeDiv(
			this.content, 
			"wrap"
		);

		// snippet head cmds
		this.cmds = this.makeDiv(
			this.snip, 
			"cmds", 
			"high"
		);

		let pinwrap = this.makeDiv(this.cmds);

		// pin btn
		this.makeDiv(
			pinwrap, 
			"cmd", 
			"pin"
		);

		let verwrap = this.makeDiv(this.cmds);

		// version number
		this.vno = this.makeDiv(
			verwrap, 
			"cmd", 
			"ver"
		);

		let sizewrap = this.makeDiv(this.cmds);

		// version number
		this.sized = this.makeDiv(
			sizewrap, 
			"cmd", 
			"siz"
		);

		// new snippet
		this.make = this.makeDiv(
			this.tools, 
			"cmd", 
			"new"
		);

		// about what
		this.about = this.makeDiv(
			this.tools, 
			"cmd", 
			"abt"
		);
		
		// open directory link
		/*this.open = this.makeDiv(
			this.tools, 
			"open"
		);*/

		// export link
		this.down = this.makeDiv(
			this.tools, 
			"cmd", 
			"dmp"
		);

		// import link
		this.up = this.makeDiv(
			this.tools, 
			"cmd", 
			"imp"
		);

		this.wraps = new Map();

		this.langs
		.forEach(
			lang => {

				let langWrap = this.makeDiv(
					this.content, 
					"lwrap", 
					"wrap-" + lang
				);

				// lang top tools ?

				let langCodes = this.makeDiv(
					langWrap, 
					"lcode"
				);

				// lang toolbar
				let langTools = this.makeDiv(
					langWrap, 
					"ltool"
				);

				// add lang was here

				this.wraps
				.set(
					lang, 
					langWrap
				);

			}
		);

		// snippet foot cmds
		this.downs = this.makeDiv(
			this.content, 
			"cmds", 
			"down"
		);

		// space
		// this.makeDiv(this.downs, "spc");

		// delete snippet
		this.del = this.makeDiv(
			this.downs, 
			"del"
		);

		// del ask btn
		this.makeDiv(
			this.del, 
			"cmd", 
			"del-ask"
		);

		// del cancel btn
		this.makeDiv(
			this.del, 
			"cmd", 
			"del-" + this.ohNo
		);

		// del confirm btn
		this.makeDiv(
			this.del, 
			"cmd", 
			"del-" + this.ohYes
		);

		this.makeDiv(this.downs, "spc");

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

		// open menu
		this.hearIt(
			this.btn, 
			this.openMenu
		);

		// close menu
		this.hearIt(
			this.cbtn, 
			this.closeMenu
		);

		// close menu mask
		this.hearIt(
			this.mmsk, 
			this.closeMenu
		);

		// change name
		/*this.hearIt(
			this.snippet, 
			this.rename
		);*/

		/*this.hearIt(
			this.header, 
			evt => 
				this.classIs(
					evt.target, 
					"cmd"
				) 
				&& this.cmdClick(evt.target)
		);*/

		this.hearIt(
			this.look, 
			evt => 
				this.lookUp(
					/** @type {KeyboardEvent} */
					(evt)
				), 
			"keyup"
		);

		this.hearIt(
			this.look, 
			this.lookIt, 
			"input"
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

		[
			this.header, 
			this.tools, 
			this.cmds, 
			this.downs
		]
		.forEach(
			cmdbar => 
				this.hearIt(
					cmdbar, 
					evt => 
						this.classIs(
							evt.target, 
							"cmd"
						) 
						&& this.cmdClick(evt.target)
				)
		);

		/*this.hearIt(
			this.cmds, 
			evt => 
				this.classIs(
					evt.target, 
					"cmd"
				) 
				&& this.cmdClick(evt.target)
		);*/

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
		// TODO HEARIT
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

		// if(DEBUG) console.log("hash", hashed.length);

		// local snippet hash
		if(hashed.length <= 20) 
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
			.register(
				"js/snippets.package-service.release.min.js", 
				// "service.js", 
				{
					// scope: "./"
				}
			);

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

			// keyboard save shortcut
			if(evt.key === "s") 
				this.saveIt(evt);
			// keyboard run shortcut
			else if(evt.key === "r") 
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

			if(DEBUG) console.log("from storage");

			this.cur = h;

			return await this.parseCodeHash(
				window.localStorage
				.getItem("snippet-" + h) 
				|| ""
			);

		}

		return null;

	}

	/**
	 * @method parseCodeHash : load code from url hash
	 * @param {string} codeHash : code hash
	 */
	async parseCodeHash(codeHash) {

		try {

			if(DEBUG) console.log("from url hash");

			let decompressed = (
				await this.decompress(codeHash)
			)
			.trim();

			if(DEBUG) console.log("unzip " + codeHash.length + " > " + decompressed.length);

			// old URI style
			if(
				decompressed
				.startsWith("md=") 
				// very old
				|| decompressed
				.startsWith("html=") 
			) 
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

			return null;

		}

	}

	/**
	 * @method loadIt : load code
	 * @param {Object=} dat : 
	 */
	loadIt(dat) {

		// if(DEBUG) console.log("load\n", dat);

		this.topIt();

		if(!dat) {

			if(DEBUG) console.log("no data");

			dat = {};

			this.clearHash();

		}

		let snippetTitle = dat["t"] || "untitled";

		this.snippet.innerHTML = 
		document.title = 
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

		this.langs
		.forEach(
			lang => {

				// if(DEBUG) console.log("lang", lang);

				this.snips[lang] = [];
				this.metas[lang] = [];
				this.codes[lang] = [];
				this.edits[lang] = [];

				if(!Array.isArray(dat[lang])) 
					dat[lang] = [dat[lang]];

				let langWrap = this.wraps
				.get(lang);

				dat[lang]
				.forEach(
					(langCode, langIndex) => {

						this.bloc(
							lang, 
							(
								lang === this.vanilla 
								&& !langIndex ? 
								this.running 
								: {
									"name": lang + "-" + langIndex, 
									"type": ""
								}
							), 
							langCode, 
							langWrap.firstChild
						);

					}
				);

			}	
		);

		let runSnippet = this.snips[this.vanilla][0];

		this.snip
		.insertBefore(
			runSnippet.wrap, 
			this.snip.firstChild
		);

		// iframe title
		// runSnippet.frame.title = this.snippet.value;
		runSnippet.frame.title = this.snippet.textContent;

		// set pre run
		runSnippet.pre = () => 
			this.preRun();

		// is local snippet
		if(this.cur) {

			this.popCmd();

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
			this.unsaved();

		}

		this.refreshIt();

		// check useful run
		let usefulRun = this.langs
		.slice(-3)
		.flatMap(
			lang => 
				this.snips[lang]
				.map(
					code => 
						code.contents.length 
				)
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

		if(this.cur) {

			this.outCmds();

		}
			

		this.cur = 
		this.snippet.innerHTML = 
		document.title = 
		"";

		// this.langs
		Object
		.keys(this.snips)
		.forEach(
			lang => {

				// if(DEBUG) console.log("remove", lang);

				this.snips[lang]
				.forEach(
					snip => {

						Snippet
						.remove(snip.id);

					}
				);

				this.snips[lang] = [];

				// TODO CLEAN CLEAR CODEMIRROR
				this.edits[lang]
				.forEach(
					editor => {

						editor
						.destroy();

						editor = null;

					}
				);

				this.edits[lang] = [];

				this.codes[lang]
				.forEach(
					code => {

						code
						.remove();

					}
				);

				this.codes[lang] = [];

			}
		);

		// this.clearHash();

	}

	/**
	 * @method bloc : code bloc
	 * @param {string} lang : bloc lang
	 * @param {Object} metas : lang meta 
	 * @param {string} content : code source
	 * @param {HTMLElement} par : lang wrap
	 */
	bloc(lang, metas, content, par) {

		if(DEBUG) console.log("bloc", lang, metas);

			// code bloc wrap
		let codeWrap = this.makeDiv(
				// this.content, 
				par, 
				"bloc"
			), 

			codeHead = this.makeDiv(
				codeWrap, 
				"chead"
			), 

			namewrap = this.makeDiv(codeHead), 

			// code name btn
			codename = this.makeIt(
				namewrap, 
				"div", 
				metas["name"] || "no name", 
				"cmd", 
				"nnm"
			), 

			togwrap = this.makeDiv(codeHead), 

			// code collapse btn
			codetoggle = this.makeDiv(
				togwrap, 
				"cmd", 
				"tog"
			);

		// code wrapper
		let codeBloc = this.makeIt(
				codeWrap, 
				"div", 
				"", 
				"code", 
				"language-" + lang
			);

		this.attrs(
			codeBloc, 
			"data-snip", 
			encodeURI(
				JSON
				.stringify(metas)
			)
		);

		// lang indicator
		/*let lng = this.makeDiv(
			codePre, 
			"lang"
		);

		this.attrs(
			lng, 
			"lang", 
			lang
		);*/

		// keep bloc
		this.codes[lang]
		.push(codeWrap);

		// CodeMirror
		let editor = this.mirrored(
			codeBloc, 
			content
		);

		this.edits[lang]
		.push(editor);

		// md snippet instance ?
		let newSnippet = new Snippet(codeBloc);

		newSnippet.cnt = () => 
			editor.state.doc
			.toString();

		// init Snippet
		this.snips[lang]
		.push(newSnippet);

		// console.log(newSnippet);

		// init meta
		this.metas[lang]
		.push(metas);

		// TODO SET ATTRS ON CODE HEAD
		// AND CALLBACK GET PARRENT

		// ref name btn
		this.attrs(
			codename, 
			{
				"lang": lang, 
				"snip": newSnippet.id
			}
		);

		// ref toggle btn
		this.attrs(
			codetoggle, 
			{
				"lang": lang, 
				"snip": newSnippet.id
			}
		);

			// code tools
		let codeTools = this.makeDiv(
				codeWrap, 
				"ctool"
			), 

			addwrap = this.makeDiv(
				codeTools
			), 

			// add code btn
			add = this.makeDiv(
				addwrap, 
				"cmd", 
				"add"
			);

		this.attrs(
			add, 
			"lang", 
			lang
		);

		// spacer
		// this.makeDiv(codeTools, "spc");

		// rem btn
		let rem = this.makeDiv(
			codeTools, 
			"rem"
		);

		// ref remove btn
		this.attrs(
			rem, 
			{
				"lang": lang, 
				"snip": newSnippet.id
			}
		);

		// rem ask btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-ask"
		);

		// rem confirm btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-" + this.ohYes
		);

		// rem cancel btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-" + this.ohNo
		);

		/*
		// rem btn
		let rem = this.makeDiv(
			codeTools, 
			"rem"
		);

		this.attrs(
			rem, 
			{
				"lang": lang, 
				"snip": newSnippet.id
			}
		);

		// rem ask btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-ask"
		);

		// rem confirm btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-" + this.ohYes
		);

		// rem cancel btn
		this.makeDiv(
			rem, 
			"cmd", 
			"rem-" + this.ohNo
		);*/

		[
			codeHead, 
			codeTools
		]
		.forEach(
			codeBar => 
				this.hearIt(
					codeBar, 
					evt => 
						this.classIs(
							evt.target, 
							"cmd"
						) 
						&& this.cmdClick(evt.target)
				)
		);

		return newSnippet;

	}

	/**
	 * @method mirrored : create code editor
	 * @param {HTMLPreElement} codePre : code container
	 * @param {string} codeContent : code
	 * @return {CodeMirror.EditorView}
	 */
	mirrored(codePre, codeContent) {

		let codeLang = /language-(\w+)/g
			.exec(codePre.className)[1], 

			codeHolder = codeLang;
			
		return Mirror
		.reflect(
			codePre, 
			codeLang, 
			codeContent, 
			codeHolder
		);

	}

	unbloc(lang, indx) {

		if(DEBUG) console.log("unbloc", lang, indx);

		Snippet
		.remove(this.snips[lang][indx].id);

		this.edits[lang][indx]
		.destroy();

		this.edits[lang][indx] = null;

		this.codes[lang][indx]
		.remove();

		this.codes[lang][indx] = null;

		[
			this.snips, 
			this.edits, 
			this.metas, 
			this.codes
		]
		.forEach(
			everyone => 
				everyone[lang]
				.splice(
					indx, 
					1
				)
		);

		// AUTOSAVE FLUSH STORE ?
		this.unsaved();

	}

	/**
	 * @method topIt : back to top
	 */
	topIt() {

		window
		.scroll(
			0, 
			0
		);

	}

	/**
	 * @method preRun : ready steady
	 */
	preRun() {

		if(!this.classIs(this.snip, "stick")) 
			this.topIt();

		this.injectLibs();

		/*this.snips[this.vanilla][0].links = this.langs
		.reduce(
			(frozen, lang) => ([
				...frozen, 
				...this.snips[lang]
				.map(
					snip => 
						"#" + snip.id
				)
			]), 
			[]
		);*/

		let links = this.langs
		.map(
			lang => 
				this.snips[lang]
				.map(
					snip => 
						"#" + snip.id
				)
		);

		// reverse linked vanilla, import bottom code first
		links[links.length - 1]
		.reverse();

		// inject links
		this.snips[this.vanilla][0].links = links
		.flat()

	}

	/**
	 * @method runIt : get that code running
	 */
	runIt() {

		// if(DEBUG) console.log("lift off");
		
		this.snips[this.vanilla][0]
		._run();

	}

	/**
	 * @method cmdClick : clicked bottom toolbar btn
	 * @param {Element} btn : cmd btn
	 */
	cmdClick(btn) {

		let dmc = Object
		.keys(this.cmd)
		.find(
			cmd => 
				this.classIs(
					btn, 
					cmd
				) 
		);

		if(dmc) {

			if(DEBUG) console.log("cmd", dmc);

			// if(this.cbs.hasOwnProperty(cmd)) 
			this.cmd[dmc]
			.bind(this)(btn);

		}

	}

	nameIt() {

		let curName = this.snippet.innerHTML;

		this.askIt(
			"", 
			curName
		)
		.then(
			newName => {

				if(newName && newName !== curName) {

					if(DEBUG) console.log("rename");

					this.snippet.innerHTML = newName;

					this.unsaved();

				}

			}
		);

	}

	/**
	 * @method openMenu : come in
	 */
	openMenu() {

		this.classOut(
			this.menu, 
			"none"
		);

		// force menu scroll top on open
		// this.lists.scrollTop = 0;

	}

	/**
	 * @method closeMenu : go away
	 */
	closeMenu() {

		this.classIt(
			this.menu, 
			"none"
		);

	}

	lookUp(evt) {

		// if(DEBUG) console.log("lookup", evt.key);

		if(evt.key === "Escape") {

			this.look.value = "";

			this.lookIt();

		}

	}

	lookIt() {

		let lookFor = this.look.value;

		if(DEBUG) console.log("look", lookFor);

		this.getAll(
			".menuitem", 
			this.list
		)
		.forEach(
			entry => 
				this.classAlt(
					entry, 
					"hide", 
					lookFor 
					&& !entry.textContent
					.includes(lookFor)
				)
		);

	}

	popIt(what) {

		let popWrap = this.makeDiv(
				document.body, 
				"popwrap"
			), 

			popModal = this.makeDiv(
				popWrap, 
				"popmod"
			), 

			popCont = this.makeDiv(
				popModal, 
				"popcnt"
			);

		if(what) 
			this.makeIt(
				popCont, 
				"div", 
				what, 
				"popwhat"
			);

		let popBtns = this.makeDiv(
				popModal, 
				"popbtns"
			);

		return [
			popWrap, 
			popCont, 
			popBtns
		];

	}

	approveIt(what) {

		let [popWrap, popCont, popBtns] = this.popIt(what);

		return new Promise(
			answerIt => {

				const gotIt = (approved = false) => {

					popWrap
					.remove();
					
					answerIt(approved);

				};

				let decline = this.makeDiv(
					popBtns, 
						"popno"
					), 

					accept = this.makeDiv(
						popBtns, 
						"popgo"
					);

				this.hearIt(
					decline, 
					() => 
						gotIt()
				);

				this.hearIt(
					accept, 
					() => 
						gotIt(true)
				);

				this.hearIt(
					popWrap, 
					evt => {

						// esc
						if(evt.which === 27) 
							gotIt();

					}, 
					"keyup"
				);

			}
		);

	}

	askIt(hld = "", val = "") {

		let [popWrap, popCont, popBtns] = this.popIt(hld);

		return new Promise(
			answerIt => {

				const gotIt = (inputVal = "") => {

					popWrap
					.remove();
					
					answerIt(inputVal);

				};

				let askText = this.makeIt(
						popCont, 
						"input", 
						"", 
						"asktext"
					), 

					askNo = this.makeDiv(
						popBtns, 
						"popno"
					), 

					askOk = this.makeDiv(
						popBtns, 
						"popok"
					);

				askText.value = val;

				this.hearIt(
					askText, 
					evt => {

						// enter
						if(evt.which === 13) 
							gotIt(askText.value);
						// esc
						else if(evt.which === 27) 
							gotIt();

					}, 
					"keyup"
				);

				this.hearIt(
					askNo, 
					() => 
						gotIt()
				);

				this.hearIt(
					askOk, 
					() => 
						gotIt(askText.value)
				);

				askText
				.focus();

			}
		);

	}

	/**
	 * @method injectLibs : 
	 */
	injectLibs() {

		let injectWhat = {
			[this.vanilla]: [], 
			[this.mod]: [], 
			// "importmap": [], 
			[this.imp]: [], 
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

				// check snippet has md
				if(this.snips[this.notes].length) {

					Array
					.from(
						this.snips[this.notes][0].contents
						.matchAll(reg)
					)
					.forEach(
						matched => 
							libs[matched[1]]
							.push(matched[2])
					);

				}

				return libs;

			}, 

			injectWhat
			
		);

		// if(DEBUG) console.log("inject\n", injections);

		let steady = this.snips[this.vanilla][0];

		Object
		.assign(
			steady, 
			{
				codes: injections[this.vanilla], 
				sheets: injections[this.looks], 
				mods: injections[this.mod], 
				imports: injections[this.imp]
			}
		);

		if(injections[this.mod].length + injections[this.imp].length) {

			if(DEBUG) console.log("module enabled");

			steady.module = true;

		}

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
		this.attrs(
			link, 
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

	}

	/**
	 * @method decompress : welcome back
	 * @param {string} b64Str : 
	 */
	async decompress(b64Str) {

		// if(DEBUG) console.log("decompress", b64Str.length);

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

		this.clearHash();

		this.loadIt();

	}

	/**
	 * @method aboutIt : about page
	 */
	aboutIt() {

		window
		.open(
			"https://github.com/nicopowa/snippets", 
			"_blank"
		);

	}

	/**
	 * @method dumpIt : 
	 * @param {Object} moreProps 
	 */
	async dumpIt(moreProps = {}) {

		let vanillaIceCream = this.snips[this.vanilla][0], 
			vanillaWrap = vanillaIceCream.wrap, 
			vanillaData = {
				// snippet codes
				...this.langs
				.reduce(
					(dumping, l) => ({
						...dumping, 
						[l]: this.snips[l]
						.map(
							snip => 
								snip.contents
						)
					}), 
					{
						// snippet title
						"t": this.snippet.innerHTML, 
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
			}, 

			vanillaJSON = JSON
			.stringify(vanillaData);

		if(DEBUG) console.log(vanillaData);

		if(DEBUG) console.log("compress", vanillaJSON.length);

		let dumped = await this.compress(vanillaJSON);

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
	 * @method genId : generate unique id
	 */
	genId() {

		return Date
		.now()
		.toString(36) 
		+ Math
		.random()
		.toString(36)
		.slice(2);

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

		document.title = this.snippet.textContent;

		// version int to xxx.x.x
		this.vno.innerHTML = "" + 
		"v" + 
		Math
		.floor(this.ver / 100) + 
		"." + 
		this.ver
		.toString()
		.padStart(3, "0")
		.slice(-2)
		.split("")
		.join(".");

		// calc size
		this.sized.innerHTML = this.formatBytes(
			this.langs
			.map(
				lang => 
					this.snips[lang]
					.map(
						snip => 
							snip.contents.length
					)
			)
			.flat()
			.reduce(
				(fullSize, moreBytes) => 
					fullSize 
					+ moreBytes, 
				0
			)
		);

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
			this.cur = this.genId();

			// v0
			this.ver = 0;

			// snippet object
			let newSnippet = {

				"i": this.cur, 
				"v": this.ver, 
				"t": this.snippet.innerHTML

			};

			// push to snippets
			this.snippets
			.push(newSnippet);

			// add menu entry
			this.menuEntry(newSnippet);

			this.popCmd();
			
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

				if(DEBUG) console.log("CHECK CHANGES IF NONE NO VER++");

				// next version
				this.ver++;

				// update title
				storedSnippet["t"] = this.snippet.innerHTML;

				// update version
				storedSnippet["v"] = this.ver;

				// update menu entry
				this.getIt(
					"[href='#" + this.cur + "']", 
					this.list
				).innerHTML = storedSnippet["t"];

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

		// safe and sound
		this.yes(this.save);

		// listen once any bloc change text and this.unsaved()

	}

	popCmd() {

		// show top cmds / version & size
		this.classIt(
			this.cmds, 
			"store"
		);

		// show bottom cmds / delete
		this.classIt(
			this.downs, 
			"store"
		);

	}

	outCmds() {

		this.classOut(
			this.cmds, 
			"store"
		);

		this.classOut(
			this.downs, 
			"store"
		);

	}

	/**
	 * @method unsaved : unsaved red tip
	 */
	unsaved() {

		this.classIt(
			this.save, 
			this.ohNo
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
			.stringify(this.snippets)
		);

	}

	codeName(btn) {

		let snippetId = this.attrg(
			btn, 
			"snip"
		), 

		snippetLang = this.attrg(
			btn, 
			"lang"
		), 
		
		snippetIndex = this.snips[snippetLang]
		.findIndex(
			snip => 
				snip.id 
				== snippetId
		), 

		snippetBloc = this.codes[snippetLang][snippetIndex], 

		isCollapsed = this.classIs(
			snippetBloc, 
			"clps"
		);

		if(isCollapsed) {

			if(DEBUG) console.log("show", snippetLang, "#" + snippetId);

			this.classOut(
				snippetBloc, 
				"clps"
			);

		}
		else {

			if(DEBUG) console.log("nnm", snippetLang, "#" + snippetId, snippetIndex);


		}

	}

	toggleCode(btn) {

		let snippetId = btn
			.getAttribute("snip"), 

			snippetLang = btn
			.getAttribute("lang"), 
			
			snippetIndex = this.snips[snippetLang]
			.findIndex(
				snip => 
					snip.id == snippetId
			), 

			snippetBloc = this.codes[snippetLang][snippetIndex];

			this.classAlt(
				snippetBloc, 
				"clps"
			);

			// reset ask remove bloc
			this.classOut(
				this.getIt(
					".rem", 
					snippetBloc
				), 
				"ask"
			);

		if(DEBUG) console.log("tog", snippetLang, "#" + snippetId, snippetIndex);

	}

	/**
	 * @method addCode : add code bloc 
	 * @param {Element} btn : 
	 */
	addCode(btn) {

		let lang = btn
		.getAttribute("lang");

		/*let lang = this.langs
		.find(
			lang => 
				this.classIs(
					btn, 
					lang
				)
		);*/

		// console.log("add code", lang);

		this.bloc(
			lang, 
			(
				{
					"name": lang + "-" + this.edits[lang].length, 
					"type": ""
				}
			), 
			"", 
			this.wraps
			.get(lang).firstChild
		);

		this.unsaved();

	}

	/**
	 * @method askRemove : ask delete code
	 * @param {Element} btn : 
	 */
	askRemove(btn) {

		this.classIt(
			btn.parentElement, 
			"ask"
		);

	}

	/**
	 * @method removeIt : remove bloc
	 * @param {Element} btn : 
	 */
	removeIt(btn) {

		let removeBtn = btn.parentNode, 
			
			snippetId = removeBtn
			.getAttribute("snip"), 

			snippetLang = removeBtn
			.getAttribute("lang"), 

			snippetIndex = this.snips[snippetLang]
			.findIndex(
				snip => 
					snip.id == snippetId
			);

		if(DEBUG) console.log("rem", snippetLang, "#" + snippetId, snippetIndex);

		this.unbloc(
			snippetLang, 
			snippetIndex
		);

		this.unsaved();

	}

	/**
	 * @method removeNo : cancel remove bloc
	 * @param {Element} btn : 
	 */
	removeNo(btn) {

		if(DEBUG) console.log("rem cancel");

		this.classOut(
			btn.parentElement, 
			"ask"
		);

	}

	/**
	 * @method askDelete : are you sure ?
	 * @param {Element} btn : 
	 */
	askDelete(btn) {

		if(DEBUG) console.log("ask del");

		this.classIt(
			btn.parentElement, 
			"ask"
		);

	}

	/**
	 * @method deleteIt : trash it
	 */
	deleteIt() {

		// if(DEBUG) console.log("confirm del");

		this.approveIt(
			"delete " 
			+ "\"" + this.snippet.textContent + "\"" 
			+ " ?"
		)
		.then(
			approved => {

				this.deleteNo();

				// console.log(approved);

				if(approved) {

					// delete from store list
					this.snippets
					.splice(
						this.snippets
						.findIndex(
							snippet => 
								snippet["i"] 
								=== this.cur
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
						"snippet-" 
						+ this.cur
					);

					// reset delete btn state
					// this.deleteNo();

					// create new snippet
					this.createIt();

				}

			}
		);

	}

	/**
	 * @method deleteNo : changed my mind
	 */
	deleteNo() {

		// if(DEBUG) console.log("cancel del");

		this.classOut(
			this.del, 
			"ask"
		);

	}

	pinUp() {

		if(this.classIs(this.snip, "stick")) {

			this.classOut(
				this.snip, 
				"stick"
			);

		}
		else {

			this.classIt(
				this.snip, 
				"stick"
			);

		}

	}

	verNo() {

		// version number click

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

				title: this.snippet.textContent, 
				url: shareURL

			});

		}
		else if(navigator.clipboard) 
			// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
			navigator.clipboard
			.writeText(shareURL)
			.then(
				() => 
					this.yes(this.copy)
			)
		/*else {

			// savage obsolete textarea copy fallback 

			let forceCopy = document
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

				this.no(this.copy);

			}

			document.body
			.removeChild(forceCopy);

		}*/

	}

	/**
	 * @method openIt : load snippet from local directory
	 */
	async openIt() {

		/*const opfsRoot = await navigator.storage.getDirectory();
		console.log(opfsRoot);

		const snippetsDir = await opfsRoot.getDirectoryHandle("snippets", {create: false});

		console.log(snippetsDir);

		for await(let subHandle of snippetsDir.values()) {

			// console.log("handle", handle);

			if(subHandle.kind === "directory") {

				if(DEBUG) console.log("dir", subHandle);

			}
			else if(subHandle.kind === "file") {

				if(DEBUG) console.log("file", subHandle);

			}

		}*/

		window
		.showDirectoryPicker()
		.then(
			dirHandle => 
				this.readDir(dirHandle)
		)
		.catch(
			err => {

				if(DEBUG) {
					
					console.log("open dir fail");
					console.log(err);	

				}

			}
		);

		/*const opfsRoot = await navigator.storage.getDirectory();
		console.log(opfsRoot);

		let theFile = "somefile";
		let theDir = "somedir";

		const directoryHandle = await opfsRoot.getDirectoryHandle(theDir, {create: true});

		const existingDirectoryHandle = await opfsRoot.getDirectoryHandle(theDir);
		console.log(existingDirectoryHandle);

		await this.readDir(existingDirectoryHandle);*/

		// const fileHandle = await directoryHandle.getFileHandle(theFile, {create: true});
		

		// const existingFileHandle = await opfsRoot.getFileHandle(theFile);
		// console.log(existingFileHandle);


	}

	async readDir(dirHandle) {

		for await(let subHandle of dirHandle.values()) {

			// console.log("handle", handle);

			if(subHandle.kind === "directory") {

				if(DEBUG) console.log("dir", subHandle);

			}
			else if(subHandle.kind === "file") {

				if(DEBUG) console.log("file", subHandle);

			}

		}

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

		this.attrs(
			forceDl, 
			{
				"href": "data:application/json;charset=utf-8," + 
					encodeURIComponent(
						JSON
						.stringify(fullDump)
					), 
				"download": this._name + ".json"
			}
		);

		forceDl.style.display = "none";

		document.body
		.appendChild(forceDl);

		forceDl
		.click();

		forceDl
		.remove();

		this.yes(this.down);

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
	 */
	yes(el) {

		this.classOut(
			el, 
			this.ohNo
		);

		this.classIt(
			el, 
			this.ohYes
		);

		setTimeout(
			() => 
				this.classOut(
					el, 
					this.ohYes
				), 
			750
		);

	}

	// and no ? classIt(el, this.ohNo)

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
	 * 
	 * @param {*} el 
	 * @param {*} cnt 
	 */
	fillIt(el, cnt) {

		el.innerHTML = cnt;

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
	 * @method getAll : querySelectorAll macro
	 * @param {string} sel : query
	 * @param {Element} par : parent
	 */
	getAll(sel, par = document.body) {

		return Array
		.from(
			par
			.querySelectorAll(
				sel
			)
		);

	}

	/**
	 * @method attrs : setAttribute macro
	 * @param {Element} el : target element
	 * @param {!(string|Object)} nameObj : attribute name or attributes object
	 * @param {!string=} maybeVal : attribute value if name
	 */
	attrs(el, nameObj, maybeVal = "") {

		if(typeof nameObj === "string") 
			nameObj = {
				[nameObj] : maybeVal
			};
			
		Object
		.keys(nameObj)
		.forEach(
			attr => 
				el
				.setAttribute(
					attr, 
					nameObj[attr]
				)
		);

	}

	/**
	 * @method attrg : getAttribute macro
	 * @param {Element} el : target element
	 * @param {string} attr : attribute name
	 */
	attrg(el, attr) {

		return el
		.getAttribute(attr);

	}

	/**
	 * @method hearIt : addEventListener macro
	 * @param {Node|Element|Window} el : 
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
	 * @param {Element} el : element
	 * @param {...string} cl : classes
	 */
	classIt(el, ...cl) {

		el.classList
		.add(...cl);

	}

	/**
	 * @method classOut : remove class macro
	 * @param {Element} el : element
	 * @param {...string} cl : classes
	 */
	classOut(el, ...cl) {

		el.classList
		.remove(...cl);

	}

	/**
	 * @method classAlt : toggle class macro
	 * @param {Element} el : element
	 * @param {string} cl : class
	 * @param {boolean=} fc : force
	 */
	classAlt(el, cl, fc) {

		el.classList
		.toggle(
			cl, 
			fc
		);

	}

	/**
	 * @method sing : 100% supergreen confetti all over the place
	 * @param {Element} el : 
	 * @param {string} aria : aria field
	 * @param {string} tune : aria value
	 */
	sing(el, aria, tune) {

		this.attrs(
			el, 
			"aria-" + aria, 
			tune
		);

	}

	formatBytes(a, b = 2) {

		if(!+a) 
			return "0B";

		let c = 0 > b ? 0 : b, 
			d = Math.floor(Math.log(a) / Math.log(1024));
		
		return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))}${["B","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}`
	
	}
	
}