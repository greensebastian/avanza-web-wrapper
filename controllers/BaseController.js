const Avanza = require("avanza-api").default;
const IBaseController = require("./IBaseController.js");

class BaseController extends IBaseController {
	constructor(config, request, response) {
		super();
		this.config = config;
		this.request = request;
		this.response = response;

		// Fetch avanza from session if possible
		this.avanza = new Avanza();
		if (request.session.avanzaSession) {
			this.avanza.session = request.session.avanzaSession;
		}
	}

	returnError(message, status = 500) {
		this.response.status(status).send(message);
	}

	errorResponse(message) {
		if (!message) {
			return "An internal error occured";
		} else {
			return message;
		}
	}
}

module.exports = BaseController;
