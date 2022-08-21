const db = require("../models/index.js");
const User = db.user;
const Room = db.room;
const Avatar = db.avatar;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

const userInfo = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.userId,
    },
  });

  const rooms = await user.getRooms();
  const avatars = await user.getAvatars();

  res.send({
    user: user,
    rooms: rooms,
    avatars: avatars,
  });
};

module.exports = {
  getAllUsers,
  userInfo,
};
