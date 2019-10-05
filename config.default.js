const USER_CREDENTIALS = {
	USERNAME: '<username>',
	PASSWORD: '<password>',
	TOTPSECRET: '<totpSecret>'
}

const LISTEN = false

const ENVS = {
	PROD: 'prod',
	DEV: 'dev'
};
const ENV = ENVS.DEV;

module.exports = {
	USER_CREDENTIALS,
	LISTEN,
	ENVS,
	ENV
};