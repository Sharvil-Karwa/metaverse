const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

const avatarInfo = (req, res) => {
  let avatarId = req.params.avatarId;

  Avatar.findOne({
    where: {
      id: avatarId,
    },
  })
    .then((avatar) => {
      User.findOne({
        where: {
          id: avatar.userId,
        },
      })
        .then((user) => {
          Room.findOne({
            where: {
              id: avatar.roomId,
            },
          })
            .then((room) => {
              res.send({
                avatar,
                user,
                room,
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
      res.send(err);
    });
};

const createAvatar = (req, res) => {
  let userId = req.params.userId;
  let roomId = req.params.roomId;

  Avatar.create({
    name: req.body.name,
    description: req.body.description,
  })
    .then((avatar) => {
      User.findOne({
        where: {
          id: userId,
        },
      })
        .then((user) => {
          Room.findOne({
            where: {
              id: roomId,
            },
          })
            .then((room) => {
              user.addAvatar(avatar);
              room.addAvatar(avatar);
              res.send(avatar);
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
      res.send(err);
    });
};

module.exports = {
  avatarInfo,
  createAvatar,
};
