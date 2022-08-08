const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateToken = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const channelName = req.query.channelName;
  if (!channelName) {
    res.status(400).send({ message: "Channel name is required" });
    return;
  }
  let uid = req.query.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  let role = RtcRole.USER;
  if (req.query.role == "admin") {
    role = RtcRole.ADMIN;
  }

  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  const currentTime = Math.floor(Date.now() / 1000);

  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  return res.json({
    token: token,
  });
};

module.exports = function (app) {
  app.get("/token", nocache, generateToken);
};
