class IBaseController {
	constructor(){
		this.typeErrorMessagePrefix = 'IBaseController implementations must implement: ';

		if (!this.send){
			throw new TypeError(typeErrorMessagePrefix + 'send');
		}
	}
}

module.exports = IBaseController;