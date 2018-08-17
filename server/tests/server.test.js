var expect = require('expect'); // expect library
var request = require('supertest'); //supertest library
var { ObjectID } = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

var {Todo} = require('./../models/todos'); //importing todo model
var {User} = require('./../models/user'); //importing todo model
var {app}  = require('./../server');

// temporary  todos array
beforeEach(populateUsers);
beforeEach(populateTodos);


/*******************************TESTING POST REQUEST*********************************/
describe('POST/todos',() => {
	it('should create new todo', (done) => {
		var text = 'Testing to do text';
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
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
		.set('x-auth', users[0].tokens[0].token)
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
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todos.length).toBe(1);
		 })
		 .end(done);
	})
}); // END OF GET/todos testing

/**************************** TESTING GET/todos/:id REQUEST ***************************/

describe('GET/todos/:id', () => {
	it('should get todo doc by id', (done) => {
		request(app)
		 .get(`/todos/${todos[0]._id.toHexString()}`)
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todo.text).toBe(todos[0].text);
		 })
		 .end(done);
	});

	it('should not return doc created by other user', (done) => {
		request(app)
		 .get(`/todos/${todos[1]._id.toHexString()}`)
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(404)
		 .end(done);
	});
	it('should return 404 if no todo found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
		 .get(`/todos/${hexId}`)
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(404)
		 .end(done);
	});
	it('should return 404 for non-object parameter',(done) => {
		request(app)
		 .get(`/todos/434353`)
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(404)
		 .end(done);
	});
}); // END OF GET/todos/:id testing 

/************************** DELETE/todos/:id TESTING *****************************/

describe('DELETE/todo/:id', () => {
	it('should delete todo by id', (done) => {
		var hexId =  todos[0]._id.toHexString();

		request(app)
		  .delete(`/todos/${hexId}`)
		  .set('x-auth', users[0].tokens[0].token)
		  .expect(200)
		  .expect((res) => {
		  	expect(res.body.todo._id).toBe(hexId);
		  })
		  .end((err, res) => {
		  	if (err) {
		  		return done(err);
		  	}

		  	Todo.findById(hexId).then((todo) => {
		  		expect(todo).toNotExist();
		  		done();
		  	}).catch((e) =>  done(e));
		  });
	});

	it('should not delete todo', (done) => {
	var hexId =  todos[0]._id.toHexString();

	request(app)
	  .delete(`/todos/${hexId}`)
	  .set('x-auth', users[1].tokens[0].token)
	  .expect(404)
	  .end((err, res) => {
	  	if (err) {
	  		return done(err);
	  	}

	  	Todo.findById(hexId).then((todo) => {
	  		expect(todo).toExist();
	  		done();
	  	}).catch((e) =>  done(e));
	  });
});

	it('should return 404 for no object found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
		   .delete(`/todos/${hexId}`)
		   .set('x-auth', users[1].tokens[0].token)
		   .expect(404)
		   .end(done);
	});
	it('should return 404 for non object error', (done) => {
		request(app)
		   .delete('/todos/2233')
		   .set('x-auth', users[1].tokens[0].token)
		   .expect(404)
		   .end(done);
	});
});

/************************* UPDATE TODOS BY ID ********************************/

describe('PATCH/todos/:id', () => {
	it('should patch by id and update', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'This should be the new text';
		request(app)
		 .patch(`/todos/${hexId}`)
		 .set('x-auth', users[1].tokens[0].token)
		 .send({
		 	completed: true,
		 	text
		 })
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todo.text).toBe(text);
		 	expect(res.body.todo.completed).toBe(true);
		 	expect(res.body.todo.completedAt).toBeA('number')
		 })
		 .end(done);

	});

	it('should not update todo created by another user', (done) => {
	var hexId = todos[1]._id.toHexString();
	var text = 'This should be the new text';
	request(app)
	 .patch(`/todos/${hexId}`)
	 .set('x-auth', users[0].tokens[0].token)
	 .send({
	 	completed: true,
	 	text
	 })
	 .expect(404)
	 .end(done);

});
}); // END OF PATCH/users/:id


describe('POST/users', () => {
	it('should create a user', (done) => {
		var email = 'test@test.com';
		var password =  'testPass';

		request(app)
		  .post('/users')
		  .set('x-auth', users[0].tokens[0].token)
		  .send({email, password})
		  .expect(200)
		  .expect((res) => {
		  	expect(res.headers['x-auth']).toExist();
		  	expect(res.body._id).toExist();
		  	expect(res.body.email).toBe(email);
		  })
		  .end((err) => {
		  	if (err) {
		  		return done(err);
		  	}

		  	User.findOne({email}).then((user) => {
		  		expect(user).toExist();
		  		expect(user.password).toNotBe(password);
		  		done();
		  	});
		});
	});

	it('should return validation errors  if request invalid', (done) => {

		request(app)
		  .post('/users')
		  .send({
		  	email:'qwewe',
		  	password: '123'
		  })
		  .expect(400)
		  .end(done);
	});

	it('should return error if email in use', (done) => {
		request(app)
		 .post('/users')
		 .send({
		 	email: users[0].email,
		 	password: '1234567'
		 })
		 .expect(400)
		 .end(done);
	});
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
}); // END OF POST/users/login

/**************************TESTING DELETE/users/me/token *****************************/
describe('DELETE/users/me/token', () => {
	it('should remove token on logout', (done) => {

		request(app)
		 .delete('/users/me/token')
		 .set('x-auth', users[0].tokens[0].token)
		 .expect(200)
		 .end((err, res) => {
		 	if (err) {
		 		return done(err);
		 	}

		 	User.findById(users[0]._id).then((user) => {
		 		expect(user.tokens.length).toBe(0);
		 		done();
		 	}).catch((e) => done(e));
		});
	});
});

/******************************TESTING GET/users/me **********************************/
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

