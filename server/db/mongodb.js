/* this file has access to database other files uses this exports */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

// exported so other files can use it
module.exports = {
	mongoose
}