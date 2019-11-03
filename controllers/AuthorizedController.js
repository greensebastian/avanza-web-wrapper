const BaseController = require("./BaseController.js");

class AuthorizedController extends BaseController {
	constructor(avanza, config, request, response) {
		super(avanza, config, request, response);
	}

	async process() {
		try {
			await this.authenticate();
		} catch (rejected){
			console.log("Authentication rejected", rejected);
			this.request.session.test = "1";
			return this.returnError(500, this.authenticationErrorResponse());
		}
		this.send();
	}

	send() {
		this.response.send("Avanza authentication succeeded");
	}

	authenticate() {
		if (this.avanza._authenticated) {
			return Promise.resolve();
		} else {
			return this.avanza.authenticate({
				username: this.config.USER_CREDENTIALS.USERNAME,
				password: this.config.USER_CREDENTIALS.PASSWORD,
				totpSecret: this.config.USER_CREDENTIALS.TOTPSECRET
			});
		}
	}

	authenticationErrorResponse(message) {
		if (!message) {
			return "An Avanza authentication error occured";
		} else {
			return message;
		}
	}
}

module.exports = AuthorizedController;
