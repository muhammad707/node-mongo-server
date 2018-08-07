var { ObjectID } = require('mongodb'); 

var {mongoose} = require('./../server/db/mongodb'); //importing mongoose
var { Todo } = require('./../server/models/todos'); //importing todo model
var { User } = require('./../server/models/user'); // imports user model

var id = '5b69b1b1971c549a6e3ae4f8';

//checks whether id is valid
// if (!ObjectID.isValid(id)) {
// 	console.log('Invalid id');
// } else {
// 	console.log('Valid id');
// }


// // returns all collections that matches id 
// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// // returns only one document (first doc)
// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// // returns document that matches id
// Todo.findById(id).then((todo) => {
// 	console.log('Todo', todo);
// });

User.findById(id).then((user) => {
	if (!user) {
		return console.log('User not found');
	}

	console.log('User found');
	console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => {
	console.log(e);
});
