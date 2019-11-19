const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task.model');
const {userId, userOne, populateDatabase} = require('./fixtures/db');

describe('Tasks tests', () => {
  beforeEach(populateDatabase);

  test('Should create a single task', async done => {
    await request(app)
      .post('/tasks')
      .set('Authorization', userOne.tokens[0].token)
      .send({description: 'test task'})
      .expect(201);
    done();
  });

  test('Should be able to update a single task', async done => {
    const descriptionUpdate = 'updated task description';
    const newTask = await new Task({
      createdBy: userId,
      description: 'x',
    }).save();
    const updatedTask = await request(app)
      .put(`/tasks/${newTask._id}`)
      .set('Authorization', userOne.tokens[0].token)
      .send({description: descriptionUpdate})
      .expect(200);
    expect(updatedTask.body.description).toBe(descriptionUpdate);
    done();
  });

  test('Should be able to mark a single task as done', async done => {
    const newTask = await new Task({
      createdBy: userId,
      description: 'x',
    }).save();
    const updatedTask = await request(app)
      .put(`/tasks/${newTask._id}`)
      .set('Authorization', userOne.tokens[0].token)
      .send({completed: true});
    expect(updatedTask.body.completed).toBe(true);
    expect(200);
    done();
  });
});
