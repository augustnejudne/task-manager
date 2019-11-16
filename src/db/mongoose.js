const mongoose = require('mongoose');

// const dbRoute = 'mongodb://127.0.0.1:27017/task-manager';
const dbRoute = process.env.MONGODB_URI;

mongoose
  .connect(dbRoute, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`connected to ${dbRoute}`);
  });
