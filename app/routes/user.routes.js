module.exports = (app) => {
  const room = require("../controllers/room.controller.js");
  const user = require("../controllers/user.controller.js");
  const avatar = require("../controllers/avatar.controller.js");
  const { authJwt } = require("../middleware");

  var router = require("express").Router();

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/allUsers", authJwt.verifyToken, user.getAllUsers); // to get all users
  router.get("/user/:userId", authJwt.verifyToken, user.userInfo); // to get user info

  router.get("/avatar/:avatarId", authJwt.verifyToken, avatar.avatarInfo); // to get avatar info
  router.post(
    "/user/:userId/room/:roomId/avatar",
    authJwt.verifyToken,
    avatar.createAvatar
  ); // to create avatar and add it to user and room

  router.get("/room/:roomId", authJwt.verifyToken, room.roomInfo); // to get room info
  router.post("/user/:userId/room", authJwt.verifyToken, room.createRoom); // to create room and add it to user

  app.use("/api", router);
};
