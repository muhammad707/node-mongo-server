var expect = require('expect'); // expect library
var request = require('supertest'); //supertest library
var { ObjectID } = require('mongodb');

var {Todo} = require('./../models/todos'); //importing todo model
var {app}  = require('./../server');

// temporary  todos array
var todos = [{
		_id: new ObjectID(),
		text: 'First test todo'
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo'
	}
];
beforeEach((done) => {
	Todo.remove({}).then(() =>{
		return Todo.insertMany(todos);
	}).then(() => done());
});

//*******************************TESTING POST REQUEST**********************************
describe('POST/todos',() => {
	it('should create new todo', (done) => {
		var text = 'Testing to do text';


		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		}).end((err, res) => {
			if (err) {
				return done(err);
			}
			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => done(e));
		});
	});

	it('should not send post request', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => {
				done(e);
			});

		});
	});
});  // END OF POST REQUEST TESTING


/****************************** TESTING GET REQUEST **********************************/

describe('GET/todos', () =>{
	it('should get all todos from db', (done) => {
		request(app)
		 .get('/todos')
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todos.length).toBe(2);
		 })
		 .end(done);
	})
}); // END OF GET/todos testing

/**************************** TESTING GET/todos/:id REQUEST ***************************/

describe('GET/todos/:id', () => {
	it('should get todo doc by id', (done) => {
		request(app)
		 .get(`/todos/${todos[0]._id.toHexString()}`)
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todo.text).toBe(todos[0].text);
		 })
		 .end(done);
	});
	it('should return 404 if no todo found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
		 .get(`/todos/${hexId}`)
		 .expect(404)
		 .end(done);
	});
	it('should return 404 for non-object parameter',(done) => {
		request(app)
		 .get(`/todos/434353`)
		 .expect(404)
		 .end(done);
	});
});

