var expect = require('expect'); // expect library
var request = require('supertest'); //supertest library

var {Todo} = require('./../models/todos'); //importing todo model
var {app}  = require('./../server');

beforeEach((done) => {
	Todo.remove({}).then(() => done());
})

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
			Todo.find().then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => done(e));
		});
	});
});
