const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

const userId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userId,
  name: 'test001',
  email: 'test001@test.com',
  password: 'pringles1432',
  tokens: [
    {
      token: jwt.sign({_id: userId}, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async done => {
  await User.deleteMany({});
  await request(app)
    .post('/users')
    .send(userOne)
    .expect(201);
  done();
});

test('Should register a new user', async done => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'test002',
      email: 'test002@test.com',
      password: 'pringles1432',
    })
    .expect(201);
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user).toMatchObject({
    name: 'test002',
    email: 'test002@test.com',
    tokens: user.tokens,
  });
  expect(user.password).not.toBe('pringles1432');
  done();
});

test('Should reject if password is less than seven character', async done => {
  await request(app)
    .post('/users')
    .send({
      name: 'test003',
      email: 'test003@test.com',
      password: '123456',
    })
    .expect(400);
  done();
});

test('Should reject registration if email is taken', async done => {
  await request(app)
    .post('/users')
    .send({
      name: userOne.name,
      email: userOne.email,
      password: userOne.password,
    })
    .expect(400);
  done();
});

test('Should reject if password contains the word password', async done => {
  await request(app)
    .post('/users')
    .send({
      name: userOne.password,
      email: userOne.password,
      password: 'password',
    })
    .expect(400);
  done();
});

test('Should reject registration email is invalid', async done => {
  await request(app)
    .post('/users')
    .send({
      name: 'test004',
      email: 'test004',
      password: 'password',
    });
  done();
});

test('Should login user', async done => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user).not.toBeNull();
  expect(response.body.token).toBe(user.tokens[2].token);
  done();
});

test('Should not login if user is non-existent', async done => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'test002@test.com',
      password: 'pringles1432',
    })
    .expect(400);
  done();
});

test('Should logout user', async done => {
  await request(app)
    .post('/users/logout')
    .set('Authorization', userOne.tokens[0].token)
    .expect(200);
  done();
});

test('Should fetch user profile', async done => {
  await request(app)
    .get('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .expect(200);
  done();
});

test('Should not fetch profile forunauthorized user', async done => {
  await request(app)
    .get('/users/me')
    .expect(401);
  done();
});

test('Should delete user account', async done => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .expect(200);
  const deletedUser = await User.findById(userOne._id);
  expect(deletedUser).toBeNull();
  done();
});

test('Should not be able to delete user account', async done => {
  await request(app)
    .delete('/users/me')
    .expect(401);
  done();
});

test('Should upload avatar image', async done => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', userOne.tokens[0].token)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
  done();
});

test('Should update user name', async done => {
  const nameUpdate = 'Shealtiel Kim P. Nejudne';
  await request(app)
    .put('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .send({name: nameUpdate})
    .expect(202);
  const user = await User.findById(userOne._id);
  expect(user.name).toBe(nameUpdate);
  done();
});

test('Should update user email', async done => {
  const emailUpdate = 'testXXX@test.com';
  await request(app)
    .put('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .send({email: emailUpdate})
    .expect(202);
  const user = await User.findById(userOne._id);
  expect(user.email).toBe(emailUpdate);
  done();
});

test('Should update user password', async done => {
  await request(app)
    .put('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .send({password: '1234567'})
    .expect(202);
  done();
});

test('Should fail when updating an unknown field', async done => {
  await request(app)
    .put('/users/me')
    .set('Authorization', userOne.tokens[0].token)
    .send({invalidField: '123123123'})
    .expect(400);
  done();
});
