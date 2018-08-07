var express = require('express'); // express library
var bodyParser = require('body-parser'); //body parser library

var { mongoose } = require('./db/mongodb'); // object destructuring that only stores mongoose property
var { Todo } = require('./models/todos'); // stores todo model
var { User } = require('./models/user'); //stores user model

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

// sends GET request 
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});



app.listen(3000, () => {
	console.log('Server listening on port 3000');
});


module.exports = {app}