
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to database');
	}

	console.log('Connected to MongoDB server');

	// db.collection('UserList').insertOne({
	// 	name: 'Mukhammadjon',
	// 	age: 21,
	// 	location: 'Baliqchi district, Andijon region'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Error occured ', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	db.collection('UserList').find({
		name: 'Andrew'
	}).toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});

	db.close();
});