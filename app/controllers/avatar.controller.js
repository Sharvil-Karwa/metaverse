const db = require("../models/index.js");
const avatar = db.avatar;

exports.createAvatar = (req, res) => {
  avatar
    .create({
      name: req.body.name,
      description: req.body.description,
    })
    .then((avatar) => {
      res.send(avatar);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.avatarInfo = (req, res) => {
  let avatarId = req.params.avatarId;

  avatar
    .findOne({
      where: {
        id: avatarId,
      },
    })
    .then((avatar) => {
      res.send(avatar);
    })
    .catch((err) => {
      res.send(err);
    });
};
