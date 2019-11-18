const app = require('./app');
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`task manager is listening on PORT: ${PORT}`);
});
