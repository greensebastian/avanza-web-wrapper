const USER_CREDENTIALS = {
	USERNAME: "<username>",
	PASSWORD: "<password>",
	TOTPSECRET: "<totpSecret>"
};

const SESSION_STORE_OPTIONS = {
	host: "<session-db-host>",
	port: "<session-db-port>",
	user: "<session-db-user>",
	password: "<session-db-user-password>",
	database: "<session-db>"
};
const SESSION_STORE_SECRET = "<session-store-secret>";

const ENVS = {
	PROD: "prod",
	DEV: "dev"
};
const ENV = ENVS.DEV;

module.exports = {
	USER_CREDENTIALS,
	SESSION_STORE_OPTIONS,
	SESSION_STORE_SECRET,
	ENVS,
	ENV
};