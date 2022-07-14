const db = require("../models/index.js");
const room = db.room;

exports.createRoom = (req, res) => {
  room
    .create({
      roomname: req.body.roomname,
      owner_id: req.body.owner_id,
    })
    .then((room) => {
      res.send(room);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.addUserToRoom = (req, res) => {
  let roomId = req.params.roomId;
  let userId = req.params.userId;

  room
    .findOne({
      where: {
        id: roomId,
      },
    })
    .then((room) => {
      room.addUser(userId);
      res.send(room);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.roomInfo = (req, res) => {
  let roomId = req.params.roomId;

  room
    .findOne({
      where: {
        id: roomId,
      },
    })
    .then((room) => {
      // find all users in the room
      room
        .getUsers()
        .then((users) => {
          res.send(users);
        })
        .catch((err) => {
          res.send(err);
        });
    });
};
