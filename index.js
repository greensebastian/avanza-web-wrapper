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