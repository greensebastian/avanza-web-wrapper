const AuthorizedController = require('./AuthorizedController.js');
class SearchController extends AuthorizedController {
	constructor(avanza, config, request, response) {
		super(avanza, config, request, response);
	}

	send() {
		this.authenticate().then(resolved => {
			this.search(this.request.query).then(resolved => {
				this.response.send('SearchController resolved search');
			}, rejected => {
				this.response.send(this.errorResponse('Search failed'));
			});
		}, rejected => {
			this.response.send(this.authenticationErrorResponse());
		});
	}

	search(query) {
		if (query.hasOwnProperty('isin')) {
			return new Promise((resolve, reject) => {
				this.avanza.search(query.isin).then(result => {
					let instrumentType = result.hits[0].instrumentType;
					let instrumentId = result.hits[0].topHits[0].id;
					this.avanza.getInstrument(instrumentType, instrumentId).then(result => {
						if (query.isin === result.isin) {
							resolve('ISIN ' + query.isin + ' matched with ' + result.name);
						} else {
							resolve('ISIN ' + query.isin + ' did not match any instrument');
						}
					});
				});
			});
		}
		// WIP, mostly for debug purposes atm
		else if (query.hasOwnProperty('q')) {
			return new Promise((resolve, reject) => {
				var output = "";

				if (query.hasOwnProperty('q')) {
					let q = query.q;
					this.avanza.search(q).then(result => {
						if (result.totalNumberOfHits == 0) {
							output = 'No results found for: ' + q;
							console.log(output);
							resolve(output);
						} else if (result.totalNumberOfHits == 1) {
							console.log('Found one match: ' + result.hits[0].topHits[0].name);
							resolve(result.hits[0].topHits[0]);
						} else {
							console.log('Found ' + result.totalNumberOfHits + ' matches, returning top 1');
							console.log(result);
							console.log(result.hits[0].topHits[0]);
							resolve(result.hits[0].topHits);
						}
					}).catch(e => {
						console.log('Caught something...');
						console.log(e);
						reject('An error occured');
					});
				} else {
					output = "You must enter a search query";
					reject(output);
				}
			});
		} else {
			return Promise.reject('Search query must contain q or isin parameters');
		}
	}
}

module.exports = SearchController;