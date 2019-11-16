require('../db/mongoose.js');
const User = require('../models/user.model.js');
const Task = require('../models/task.model.js');

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {age});
  const count = await User.countDocuments({age});
  return count;
};

const deleteTaskAndCount = async(id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({});
  return count;
}

// updateAgeAndCount('5dc0fbabbec1877b2b1c9c01', 2)
//   .then(count => {
//     console.log(count);
//   })
//   .catch(e => {
//     console.log(e);
//   });

deleteTaskAndCount('5dc11b415cf6343ac84358cc')
  .then(count => console.log(count))
  .catch(e => console.log(e));
