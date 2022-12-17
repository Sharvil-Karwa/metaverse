const app = require("./app");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaughtException");
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

const db = require("./models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
});
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log("Server is running on port " + process.env.port);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
