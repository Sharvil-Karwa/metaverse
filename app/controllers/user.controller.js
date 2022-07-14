const db = require("../models/index.js");
const user = db.user;

exports.createUser = (req, res) => {
  user
    .create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.userInfo = (req, res) => {
  let userId = req.params.userId;

  user
    .findOne({
      where: {
        id: userId,
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
                user: user,
                rooms: rooms,
                avatars: avatars,
              });
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });
};

exports.addAvatarToUser = (req, res) => {
  let userId = req.params.userId;
  let avatarId = req.params.avatarId;

  user
    .findOne({
      where: {
        id: userId,
      },
    })
    .then((user) => {
      user.addAvatar(avatarId);
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
