const app = require("./app");

const port = process.env.PORT || 6000;

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
