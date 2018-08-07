var expect = require('expect'); // expect library
var request = require('supertest'); //supertest library

var {Todo} = require('./../models/todos'); //importing todo model
var {app}  = require('./../server');

// temporary  todos array
var todos = [{
		text: 'First test todo'
	},
	{
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


/******************************TESTING GET REQUEST **********************************/

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
});

