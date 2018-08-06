
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to database');
	}

	console.log('Connected to MongoDB server');

	db.collection('UserList').findOneAndUpdate({
		_id: new ObjectID('5b688bf4210e560548567b9a')
	}, 
	{
		$set: {
			name: 'Sirojiddinov'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((docs) => {
		console.log(docs);
	}, (e) => {
		console.log('Unable to update');
	});

	//db.close();
});