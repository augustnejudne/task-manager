const express = require('express');
require('./db/mongoose.js');

const app = express();

app.use(express.json());

// routes
app.get('/', (req, res) => res.send('Task manager app by Kim Nejudne'));
app.use('/users', require('./routes/users.routes.js'));
app.use('/tasks', require('./routes/tasks.routes.js'));

module.exports = app;
