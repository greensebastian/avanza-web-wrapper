const AuthorizedController = require("./AuthorizedController.js");
class OverviewController extends AuthorizedController {
	constructor(config, request, response) {
		super(config, request, response);
	}

	send() {
		this.getOverview(this.request.query).then(
			resolved => {
				this.response.send(resolved);
			},
			rejected => {
				console.log("Overview retrieval failed: " + rejected);
				this.returnError("Overview retrieval failed");
			}
		);
	}

	async getOverview() {
		let result = await this.avanza.getAccountsSummary();
		return result;
	}
}

module.exports = OverviewController;
