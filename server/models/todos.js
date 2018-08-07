const mongoose = require('mongoose');
// Todo model stores todo copleted and time stamp
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	completed: {
		type: Boolean,
		default: false,
		required: true
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo}