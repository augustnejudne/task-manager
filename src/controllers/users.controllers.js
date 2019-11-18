const User = require('../models/user.model');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account.js');

// GET controllers
const getUserProfile = async (req, res) => {
  res.send(req.user);
};

const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id});
    if (!user.avatar) {
      res.status(404).send('Cannot find avatar');
      return;
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// POST controllers
const registerUser = async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();
    const token = await newUser.generateAuthToken();
    await sendWelcomeEmail(newUser.email, newUser.name);
    res.status(201).send({user: newUser, token});
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({user, token});
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token,
    );
    await req.user.save();
    res.send('Logout successful');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const logoutAllUserSessions = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send('Successfully logged out on all devices.');
  } catch (e) {
    res.stat(500).send(e.message);
  }
};

const uploadFile = async (req, res) => {
  // convert the uploaded image file to png
  // resize the uploaded image
  const buffer = await sharp(req.file.buffer)
    .resize({width: 250, height: 250})
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
};

// PUT controllers
const updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdateFields = ['name', 'email', 'password', 'age'];
  const isValidUpdate = updates.every(update => {
    return validUpdateFields.includes(update);
  });

  if (!isValidUpdate) {
    res
      .status(400)
      .send(
        `Invalid update field ${updates}. Accepted fields are: ${validUpdateFields}`,
      );
    return;
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(202).send(req.user);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// DELETE controllers
const deleteUser = async (req, res) => {
  try {
    await sendCancelationEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const deleteAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  getUserProfile,
  getUserAvatar,
  registerUser,
  loginUser,
  logoutUser,
  logoutAllUserSessions,
  uploadFile,
  updateUserProfile,
  deleteUser,
  deleteAvatar,
};
