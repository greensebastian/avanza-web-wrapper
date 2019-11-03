const SESSION_STORE_OPTIONS = {
	host: "<session-db-host>",
	port: "<session-db-port>",
	user: "<session-db-user>",
	password: "<session-db-user-password>",
	database: "<session-db>"
};
const SESSION_STORE_SECRET = "<session-store-secret>";
const SESSION_MAXAGE = 1000 * 60 * 10;

const ENVS = {
	PROD: "prod",
	DEV: "dev"
};
const ENV = ENVS.DEV;

module.exports = {
	SESSION_STORE_OPTIONS,
	SESSION_STORE_SECRET,
	SESSION_MAXAGE,
	ENVS,
	ENV
};