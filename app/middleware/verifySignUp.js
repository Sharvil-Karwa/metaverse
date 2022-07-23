const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    res.status(400).send({
      message: "Username already exists",
    });
    return;
  }

  const userEmail = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (userEmail) {
    res.status(400).send({
      message: "Email already exists",
    });
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};
module.exports = verifySignUp;
