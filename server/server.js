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

app.post('/todos', (req, res) => {
	 var todo = new Todo({
		text: req.body.text
	 });

	 todo.save().then((doc) => {
		res.send(doc);
	 }, (e) => {
		res.status(400).send(e);
	 });

}); // End of Post request

// sends GET request  and returns all todos
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

// GET an Individual Resouce

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findById(id).then((todo) =>{
		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

// Deleting todo by id 

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});


});

// Update todos by id 

app.patch('/todos/:id', (req, res) => {
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

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send()
	})
}); // End of PATCH request

/*
  Adding user to users collection
*/
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate,  (req, res) => {
	res.send(req.user);
});

// Port 
app.listen(3000, () => {
	console.log(`Server is running on port ${port}`);
});


module.exports = {app}