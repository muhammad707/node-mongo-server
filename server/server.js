require('./config/config');

const express = require('express'); // express library
const bodyParser = require('body-parser'); //body parser library
const { ObjectID } = require('mongodb');
const _ = require('lodash');
var { mongoose } = require('./db/mongodb'); // object destructuring that only stores mongoose property
var { Todo } = require('./models/todos'); // stores todo model
var { User } = require('./models/user'); //stores user model
var {authenticate} = require('./middleware/authenticate'); //authenticate middleware

const port =  3000;
var app = express(); // installing route

app.use(bodyParser.json());

// POST/todos if authenticated and also add creator id to todo model
app.post('/todos', authenticate, async (req, res) => {
	 try {
	 	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
		 });
		 var doc = await todo.save();
		 res.send(doc);
	 } catch (e) {
	 	res.status(400).send(e);
	 }

}); // End of Post request

// sends GET request  and returns all todos
app.get('/todos', authenticate, async (req, res) => {
	try {
		var todos = await Todo.find({
		_creator: req.user._id
		});
		res.send({todos});
	} catch (e) {
		res.status(400).send(e);
	}
});

// GET an Individual Resouce

app.get('/todos/:id', authenticate, async (req, res) => {
	try{
		var id = req.params.id;
		if (!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		var todo = await Todo.findOne({
			_id: id,
			_creator: req.user._id
		});
		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});

// Deleting todo by id 

app.delete('/todos/:id', authenticate, async (req, res) => {
	try {
		var id = req.params.id;
		if (!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		var todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		});
		if (!todo) {
			return res.status(404).send();
		} 
		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});

// Update todos by id 

app.patch('/todos/:id', authenticate, async (req, res) => {
	try {
		var id = req.params.id;
		var body = _.pick(req.body, ['text', 'completed']);
		if (!ObjectID.isValid(id)) {
			return res.status(404).send();
		}

		if (_.isBoolean(body.completed) && body.completed) {
			body.completedAt = new Date().getTime();
		} else  {
			body.completed = false;
			body.completedAt = null;
		}

		var todo = await Todo.findOneAndUpdate({
			_id: id,
			_creator: req.user._id
		}, {$set: body}, {new: true});

		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
}); // End of PATCH request

/*
  Adding user to users collection
*/
app.post('/users', async (req, res) => {
  try {
  	var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
	await user.save();
    var token = await user.generateAuthToken();
     res.header('x-auth', token).send(user);
  } catch (e) {
  	res.status(400).send(e);
  }
});

app.get('/users/me', authenticate,  (req, res) => {
	res.send(req.user);
});

// LOGIN ROUTE

app.post('/users/login', async (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	try {
		var user = await User.findByCredentials(body.email, body.password);
		var token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send();
	}
});

app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
});

// Port 
app.listen(3000, () => {
	console.log(`Server is running on port ${port}`);
});


module.exports = {app}