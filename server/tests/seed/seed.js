const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/user');
var userOneId = new ObjectID();
var userTwoId = new  ObjectID();
var users = [{
	_id:userOneId,
	email: 'mukhammadjon.707s@gmail.com',
	password: 'inha707',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'sirojiddinov.1881@mail.ru',
	password: 'grey707',
	_creator: userTwoId,
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
	}]
}];


var todos = [{
		_id: new ObjectID(),
		text: 'First test todo',
		_creator: userOneId
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
		_creator:userTwoId,
		completed: true,
		completedAt: 777
	}
];

const populateTodos = (done) => {
	Todo.remove({}).then(() =>{
		return Todo.insertMany(todos);
	}).then(() => done());
}

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne =  new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};
module.exports = {todos, populateTodos, users, populateUsers}