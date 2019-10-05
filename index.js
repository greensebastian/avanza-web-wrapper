// Load avanza package
const Avanza = require('avanza');
const avanza = new Avanza();

// Load web service functions
const express = require('express');
const app = express();

// Attempt to load config file
var config_temp
try {
	config_temp = require('./config.js');
} catch (e) {
	console.log('No valid config found, modify and rename config.default.js');
	return;
}
const config = config_temp;

avanza.authenticate({
	username: config.USER_CREDENTIALS.USERNAME,
	password: config.USER_CREDENTIALS.PASSWORD,
	totpSecret: config.USER_CREDENTIALS.TOTPSECRET
}).then(authenticationResolved, authenticationRejected);

async function authenticationResolved(){
	console.log('Authenticated');
	if (config.ENV === config.ENVS.PROD){
		console.log('Production environment settings loaded');
	}

	else if (config.ENV === config.ENVS.DEV){
		console.log('Developer environment settings loaded');
		// console.log('Fetching overview...');
		// const overview = await avanza.getOverview();
		// console.log(overview);

		// console.log('Fetching positions...');
		// const positions = await avanza.getPositions();
		// console.log(positions.instrumentPositions);
		// for (var i = 0; i < positions.instrumentPositions.length; i++) {
		// 	var instrument = positions.instrumentPositions[i];
		// 	console.log('Fetching instrument type: ' + instrument.instrumentType);
		// 	for (var j = 0; j < instrument.positions.length; j++) {
		// 		var position = instrument.positions[j];
		// 		const period = Avanza.ONE_YEAR;
		// 		console.log('Fetching position: ' + position.name + " with orderbookId: " + position.orderbookId + " and period: " + period);
		// 		const chartData = await avanza.getChartdata(position.orderbookId, period);
		// 		console.log('Chart data for ' + position.name);
		// 		console.log(chartData);
		// 	}
		// }
	}
}

async function authenticationRejected(){
	console.log('Authentication failed');
}

app.listen(8000, () => {
	console.log('Example app listening on port 8000!');
});

app.get('/', (req, res) => {
	res.send('Hello Nodejs!');
});

app.get('/avanza', (req, res) => {
	console.log('\nIncoming request:\n');
	console.log(req.query);
	res.send('Hello Avanza!');
});

app.get('/avanza/search', (req, res) => {
	console.log('\nIncoming request:');
	console.log(req.originalUrl);
	console.log('Query:');
	console.log(req.query);
	
	let output = search(req.query).then(output => res.send(output));
});

async function search(query) {
	if (query.hasOwnProperty('isin')){
		return new Promise(resolve =>{
			avanza.search(query.isin).then(result => {
				let instrumentType = result.hits[0].instrumentType;
				let instrumentId = result.hits[0].topHits[0].id;
				avanza.getInstrument(instrumentType, instrumentId).then(result => {
					resolve('ISIN ' + query.isin + ' matched with ' + result.name);
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