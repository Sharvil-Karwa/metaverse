const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

const user = require("./routes/user.routes");

app.use("/api/v1/user", user);
app.use(errorMiddleware);

module.exports = app;
