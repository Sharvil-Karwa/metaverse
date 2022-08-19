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
    const refreshToken = jwt.sign(
      {
        username: userCredentials.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      auth: true,
      token: token,
      user: user,
      refreshToken: refreshToken,
    });
  });
};

const refresh = async (req, res) => {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Verifying refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // Wrong Refesh Token
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          // Correct token we send a new access token
          const accessToken = jwt.sign(
            {
              username: userCredentials.username,
              email: userCredentials.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );
          return res.json({ accessToken });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};

module.exports = {
  signup,
  signin,
  refresh,
};
