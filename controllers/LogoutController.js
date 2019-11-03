const BaseController = require("./BaseController.js");

class LogoutController extends BaseController {
	constructor(config, request, response) {
		super(config, request, response);
	}

	async process() {
		this.avanza.expireSession();
		console.log("Removing session: " + this.request.session.id);
		await this.request.session.destroy();
		this.send();
	}

	send() {
		this.response.send("Successfully logged out!");
	}
}

module.exports = LogoutController;
