const ModuleBase = require.main.require("./files/base/_server/base");

class SnippetPlayground extends ModuleBase {

	constructor(name, app) {
		super(name, app);
		
	}

	async construct() {
		await super.construct();
		
		return Promise
		.resolve(this);
	}

}

module.exports = SnippetPlayground;