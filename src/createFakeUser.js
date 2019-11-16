// const mongoose = require('mongoose');
const faker = require('faker');
const User = require('./models/user.model');

const createFakeUsers = async () => {
  for (let i = 1; i <= 100; i++) {
    let newUser = new User({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'QP@ssw0rdQ',
    });
    newUser.save();
    continue;
  }
};

createFakeUsers();
