// Load web service functions
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// Load cryptography package
const sjcl = require("sjcl");

// Load all controllers
const controllers = require("./controllers");

// Initialize root folder variable
var path = require("path");
global.rootPath = path.resolve(__dirname);

// Attempt to load config file
var configTemp;
try {
	configTemp = require("./config.js");
} catch (e) {
	console.log("No valid config found, modify and rename config.default.js");
	return;
}
const config = configTemp;

// Set up session store
app.use(cookieParser());
const sessionStore = new MySQLStore(config.SESSION_STORE_OPTIONS);
const currentSession = new session({
	secret: sjcl.hash.sha256.hash(config.SESSION_STORE_SECRET).toString(),
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: config.SESSION_MAXAGE
	}
});
app.use(currentSession);

// Start web service
const server = app.listen(8000, () => {
	console.log("Example app listening on port 8000!");
});

app.get("/", (req, res) => {
	let controller = new controllers.OverviewController(config, req, res);
	controller.process();
});

app.get("/search", (req, res) => {
	let controller = new controllers.SearchController(config, req, res);
	controller.process();
});

app.get("/logout", (req, res) => {
	let controller = new controllers.LogoutController(config, req, res);
	controller.process();
});

/*
 * Exit handling for cleanup
 */
function exitHandler(options, exitCode) {
	if (options.cleanup) {
		//avanza.disconnect();
	}
	if (exitCode || exitCode === 0) console.log(exitCode);
	if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
