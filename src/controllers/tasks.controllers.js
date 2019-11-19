const Task = require('../models/task.model');

// GET controllers
const getAllTasks = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const skip = limit * (page - 1);
  const query = {};
  const sort = {};
  query.createdBy = req.user.id;
  if (req.query.completed) {
    query.completed = req.query.completed;
  }
  if (req.query.sortBy) {
    const [sortField, sortDirection] = req.query.sortBy.split(':');
    sort[sortField] = sortDirection;
  }
  try {
    const tasksCount = await Task.find(query).countDocuments();
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res.send({
      results: tasks,
      page: page || 0,
      limit: limit || 0,
      totalPages: Math.ceil(tasksCount / req.query.limit) || 1,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getOneTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (task) {
      res.send(task);
    } else {
      res.status(404).send(`Task with id: ${req.params.id} was not found.`);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// POST controllers
const addOneTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    newTask.createdBy = req.user.id;
    await newTask.save();
    res.status(201).send(newTask);
  } catch (e) {
    res.status(401).send(e.message);
  }
};

// PUT controllers
const updateOneTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdateFields = ['description', 'completed', 'createdBy'];
  const isValidUpdate = updates.every(update =>
    validUpdateFields.includes(update),
  );

  if (!isValidUpdate) {
    res
      .status(400)
      .send(`Invalid update. Acceptable fields are: ${validUpdateFields}`);
    return;
  }

  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      {new: true},
    );
    if (!task) {
      res.status(404).send(`Cannot find task with id: ${req.params.id}`);
      return;
    }
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// DELETE controllers
const deleteOneTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!task) {
      res
        .status(404)
        .send(`Delete failed. Cannot find task with id ${req.params.id}`);
      return;
    }
    res.send(`Succesfully deleted task with id: ${req.params.id}`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  getAllTasks,
  getOneTask,
  addOneTask,
  updateOneTask,
  deleteOneTask,
};
