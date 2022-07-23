const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

const roomInfo = async (req, res) => {
  let roomId = req.params.roomId;

  const room = await Room.findOne({
    where: {
      id: roomId,
    },
  });

  const avatars = await room.getAvatars();

  const user = await User.findOne({
    where: {
      id: room.userId,
    },
  });

  res.send({
    room: room,
    owner: user,
    avatars: avatars,
  });
};

const createRoom = async (req, res) => {
  let userId = req.params.userId;

  const room = await Room.create({
    roomname: req.body.roomname,
  });

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  user.addRoom(room);

  res.send({
    room: room,
    owner: user,
  });
};

module.exports = {
  roomInfo,
  createRoom,
};
