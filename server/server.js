const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

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
		required: true
	}
});

var newTodo = new Todo({
	text: ' Learn Nodejs    ',
	completed: true,
	completedAt: 123
});

newTodo.save().then((docs) => {
	console.log(docs);
}, (e) => {
	console.log('Unable to add todos');
});