const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => { 
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo item in the db', (done) => {
        var text = 'test string';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
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

    it('should not create todo with invalid body data', (done) => {
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
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        var idHex = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${idHex}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non-object IDs', (done) => {
        request(app)
            .get('/todos/nonexistentURL')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var idHex = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${idHex}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(idHex)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(idHex).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if todo not found', (done) => {
        var idHex = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${idHex}`)
            .expect(404)
            .end(done)
    });

    it('should return a 404 for non-object IDs', (done) => {
        request(app)
            .delete('/todos/nonexistentURL')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var updates = {
            text: 'New item to check against',
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(updates)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updates.text);
                expect(res.body.todo.completed).toBe(updates.completed);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo incomplete', (done) => {
        var id = todos[1]._id.toHexString();
        var updates = {
            text: 'New item to check against',
            completed: false
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(updates)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updates.text);
                expect(res.body.todo.completed).toBe(updates.completed);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});
