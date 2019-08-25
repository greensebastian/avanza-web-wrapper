const Avanza = require('avanza');
const avanza = new Avanza();

// Attempt to load config file
var config_temp
try{
	config_temp = require('./config.js')
}
catch (e){
	console.log('No valid config found, modify and rename config.default.js')
	return
}
const config = config_temp


avanza.authenticate({
	username: config.USER_CREDENTIALS.USERNAME,
	password: config.USER_CREDENTIALS.PASSWORD,
	totpSecret: config.USER_CREDENTIALS.TOTPSECRET
}).then(async () => {
	console.log('Fetching overview...')
	const overview = await avanza.getOverview()
	console.log(overview)

	console.log('Fetching positions...')
	const positions = await avanza.getPositions()
	console.log(positions.instrumentPositions)
	for(var i = 0; i < positions.instrumentPositions.length; i++){
		var instrument = positions.instrumentPositions[i]
		console.log('Fetching instrument type: ' + instrument.instrumentType)
		for (var j = 0; j < instrument.positions.length; j++){
			var position = instrument.positions[j]
			const period = Avanza.ONE_YEAR
			console.log('Fetching position: ' + position.name + " with orderbookId: " + position.orderbookId + " and period: " + period)
			const chartData = await avanza.getChartdata(position.orderbookId, period)
			console.log('Chart data for ' + position.name)
			console.log(chartData)
		}
	}
})
console.log('Logging Avanza to console')


// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
// 	res.send('Hello World!')
// });

// app.get('/avanza', (req, res) => {
// 	res.send('Hello Avanza!')
// });

// app.listen(8000, () => {
// 	console.log('Example app listening on port 8000!')
// });