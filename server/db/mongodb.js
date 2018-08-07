/* this file has access to database other files uses this exports */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

// exported so other files can use it
module.exports = {
	mongoose
}