const AuthorizedController = require("./AuthorizedController.js");
const { FormatHelper } = require("../util/FormatHelper.js");
class SearchController extends AuthorizedController {
	constructor(config, request, response) {
		super(config, request, response);
	}

	send() {
		this.search(this.request.query).then(
			resolved => {
				this.response.send(resolved);
			},
			rejected => {
				console.log("Search failed:" + rejected);
				this.returnError("Search failed");
			}
		);
	}

	noSearchResults(query) {
		return "No search results were found for: " + query;
	}

	async search(query) {
		let result;
		if (Object.prototype.hasOwnProperty.call(query, "isin")) {
			result = await this.avanza.search(query.isin);
		} else if (Object.prototype.hasOwnProperty.call(query, "q")) {
			result = await this.avanza.search(query.q);
		}
		return result;
	}
}

module.exports = SearchController;
