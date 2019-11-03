const BaseController = require("./BaseController.js");

class AuthorizedController extends BaseController {
	constructor(config, request, response) {
		super(config, request, response);
	}

	async process() {
		try {
			await this.authenticate();
		} catch (rejected) {
			console.log("Authentication rejected", rejected);
			return this.returnError(this.authenticationErrorResponse());
		}
		this.send();
	}

	send() {
		this.response.send("Avanza authentication succeeded");
	}

	authenticate() {
		if (this.avanza.isAuthenticated) {
			return Promise.resolve();
		} else {
			if (!this.request.query.personnumber) {
				return Promise.reject("No person number specified");
			}
			return this.avanza
				.authenticate({
					personnummer: this.request.query.personnumber
				})
				.then(resolved => {
					console.log(
						"Authentication successful, storing credentials in session id: " +
							this.request.session.id
					);
					this.request.session.avanzaSession = this.avanza.session;
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
