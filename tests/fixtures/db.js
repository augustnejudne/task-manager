const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user.model');
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

const populateDatabase = async done => {
  await User.deleteMany({});
  await new User(userOne).save();
  done();
};

module.exports = {
  userId,
  userOne,
  populateDatabase,
};
