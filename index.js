// Load avanza package
const Avanza = require('avanza');
const avanza = new Avanza();

// Load web service functions
const express = require('express');
const app = express();

// Load all controllers
const controllers = require('./controllers');

// Initialize root folder variable
var path = require('path');
global.rootPath = path.resolve(__dirname);

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
const server = app.listen(8000, () => {
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

/*
 * Exit handling for cleanup
 */
function exitHandler(options, exitCode) {
	if (options.cleanup){
		avanza.disconnect();
	}
	if (exitCode || exitCode === 0) console.log(exitCode);
	if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));