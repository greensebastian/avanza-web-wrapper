const BaseController = require("./BaseController.js");

class AuthorizedController extends BaseController {
	constructor(avanza, config, request, response) {
		super(avanza, config, request, response);
	}

	send() {
		this.authenticate().then(
			resolved => {
				this.response.send("Avanza authentication succeeded");
			},
			rejected => {
				this.response.send(this.authenticationErrorResponse());
			}
		);
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
