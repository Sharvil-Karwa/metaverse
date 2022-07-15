const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.userInfo = (req, res) => {
  User.findOne({
    where: {
      id: req.params.userId,
    },
  })
    .then((user) => {
      user
        .getRooms()
        .then((rooms) => {
          user
            .getAvatars()
            .then((avatars) => {
              res.send({
                user,
                rooms,
                avatars,
              });
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};
