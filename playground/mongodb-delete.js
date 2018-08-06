
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to database');
	}

	console.log('Connected to MongoDB server');

	db.collection('UserList').deleteMany({ name: 'Jen' }).then((result) => {
		console.log(result);
	});

	//db.close();
});