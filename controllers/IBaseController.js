class IBaseController {
	constructor() {
		this.typeErrorMessagePrefix =
			"IBaseController implementations must implement: ";

		if (!this.send) {
			throw new TypeError(this.typeErrorMessagePrefix + "send");
		}
		if (!this.process) {
			throw new TypeError(this.typeErrorMessagePrefix + "process");
		}
	}
}

module.exports = IBaseController;
