var env = process.env.NODE_ENV || 'development';

if (env === 'test' || env === 'development') {
	var config = require('./config.json');
	console.log(config);
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}
