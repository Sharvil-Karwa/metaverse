const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400,
  });

  res.status(200).send({ auth: true, token: token, user: user });
};

const signin = async (req, res) => {
  if (req.body.username == null || req.body.password == null) {
    return res.status(400).send({ message: "Username and password required" });
  }

  await User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        accessToken: null,
        message: "Invalid Password",
      });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token: token, user: user });
  });
};

module.exports = {
  signup,
  signin,
};
