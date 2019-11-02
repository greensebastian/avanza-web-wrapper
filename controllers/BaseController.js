const IBaseController = require("./IBaseController.js");
class BaseController extends IBaseController {
	constructor(avanza, config, request, response) {
		super();
		this.avanza = avanza;
		this.config = config;
		this.request = request;
		this.response = response;
	}

	returnError(status, message){
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
