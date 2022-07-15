const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

exports.roomInfo = (req, res) => {
  let roomId = req.params.roomId;

  Room.findOne({
    where: {
      id: roomId,
    },
  })
    .then((room) => {
      room
        .getAvatars()
        .then((avatars) => {
          res.send({
            room,
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
};

exports.createRoom = (req, res) => {
  let userId = req.params.userId;

  Room.create({
    roomname: req.body.roomname,
  })
    .then((room) => {
      User.findOne({
        where: {
          id: userId,
        },
      })
        .then((user) => {
          user.addRoom(room);
          res.send(room);
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};
