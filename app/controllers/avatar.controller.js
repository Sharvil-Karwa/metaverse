const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

const avatarInfo = async (req, res) => {
  const avatar = await Avatar.findOne({
    where: {
      id: req.params.avatarId,
    },
  });

  if (!avatar) {
    return res.status(404).send({ message: "Avatar not found" });
  }

  const user = await User.findOne({
    where: {
      id: avatar.userId,
    },
  });

  const room = await Room.findOne({
    where: {
      id: avatar.roomId,
    },
  });

  res.send({
    avatar: avatar,
    user: user,
    room: room,
  });
};

const createAvatar = async (req, res) => {
  let userId = req.params.userId;
  let roomId = req.params.roomId;

  const avatar = await Avatar.create({
    userId: userId,
    roomId: roomId,
    name: req.body.name,
    description: req.body.description,
  });

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  const room = await Room.findOne({
    where: {
      id: roomId,
    },
  });

  user.addAvatar(avatar);
  room.addAvatar(avatar);

  res.send({
    avatar: avatar,
    user: user,
    room: room,
  });
};

const deleteAvatar = async (req, res) => {
  const delete_status = await Avatar.destroy({
    where: {
      id: req.params.avatarId,
    },
  });

  res.send({
    delete: delete_status,
  });
};

module.exports = {
  avatarInfo,
  createAvatar,
  deleteAvatar,
};
