// Load avanza package
const Avanza = require('avanza');
const avanza = new Avanza();

// Load web service functions
const express = require('express');
const app = express();

// Load all controllers
const controllers = require('./controllers');

// Attempt to load config file
var config_temp
try {
	config_temp = require('./config.js');
} catch (e) {
	console.log('No valid config found, modify and rename config.default.js');
	return;
}
const config = config_temp;

// Start web service
app.listen(8000, () => {
	console.log('Example app listening on port 8000!');
});

app.get('/', (req, res) => {
	controller = new controllers.AuthorizedController(avanza, config, req, res);
	controller.send();
});

app.get('/avanza', (req, res) => {
	controller = new controllers.AuthorizedController(avanza, config, req, res);
	controller.send();
});

app.get('/avanza/search', (req, res) => {
	controller = new controllers.SearchController(avanza, config, req, res);
	controller.send();
});

async function search(query) {
	if (query.hasOwnProperty('isin')){
		return new Promise(resolve =>{
			avanza.search(query.isin).then(result => {
				let instrumentType = result.hits[0].instrumentType;
				let instrumentId = result.hits[0].topHits[0].id;
				avanza.getInstrument(instrumentType, instrumentId).then(result => {
					if (query.isin === result.isin){
						resolve('ISIN ' + query.isin + ' matched with ' + result.name);
					}
					else {
						resolve('ISIN ' + query.isin + ' did not match any instrument');
					}
				});
			});
		});
	}
	// WIP, does not work as expected
	else if (query.hasOwnProperty('ticker')){
		return new Promise(resolve =>{
			avanza.search(query.ticker).then(result => {
				var match = searchResultForTicker(query.ticker, result);
				resolve('Ticker ' + query.ticker + ' matched with ' + match.name);
			});
		});
	}
	// WIP, mostly for debug purposes atm
	else if (query.hasOwnProperty('q')){
		return new Promise(resolve => {
			//TODO add type search
			var output = "";

			if (query.hasOwnProperty('q')) {
				let q = query.q;
				avanza.search(q).then(result => {
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
					resolve('An error occured');
				});
			} else {
				output = "You must enter a search query.";
				resolve(output);
			}
		});
	}
	else {

	}
}

// This is work in progress and definitely wrong
function searchResultForTicker(ticker, result){
	var match = null;
	result.hits.forEach(hit => {
		hit.topHits.forEach(topHit => {
			if (topHit.tickerSymbol === ticker){
				match = topHit;
			}
		});
	});
	return match;
}

function isProduction(){
	return config.ENV === config.ENVS.PROD;
}

function isDev(){
	return config.ENV === config.ENVS.DEV;
}