const AuthorizedController = require("./AuthorizedController.js");
const { FormatHelper } = require("../util/FormatHelper.js");
class SearchController extends AuthorizedController {
	constructor(avanza, config, request, response) {
		super(avanza, config, request, response);
	}

	send() {
		this.authenticate().then(
			resolved => {
				this.search(this.request.query).then(
					resolved => {
						this.response.send(resolved);
					},
					rejected => {
						this.response.send(this.errorResponse("Search failed"));
					}
				);
			},
			rejected => {
				this.response.send(this.authenticationErrorResponse());
			}
		);
	}

	noSearchResults(query) {
		return "No search results were found for: " + query;
	}

	async search(query) {
		if (Object.prototype.hasOwnProperty.call(query, "isin")) {
			let result = await this.avanza.search(query.isin);
			if (result.totalNumberOfHits === 0) {
				return this.noSearchResults(query.isin);
			} else if (result.totalNumberOfHits > 0) {
				let instrumentType = result.hits[0].instrumentType;
				let instrumentId = result.hits[0].topHits[0].id;
				let instrument = await this.avanza.getInstrument(
					instrumentType,
					instrumentId
				);
				return instrument;
			}
		} else if (Object.prototype.hasOwnProperty.call(query, "q")) {
			let result = await this.avanza.search(query.q);
			if (result.totalNumberOfHits === 0) {
				return this.noSearchResults(query.q);
			} else if (result.totalNumberOfHits > 0) {
				let resultList = FormatHelper.searchToList(result);
				return resultList;
			}
		}
	}
}

module.exports = SearchController;
