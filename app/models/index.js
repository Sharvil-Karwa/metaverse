const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.avatar = require("../models/avatar.model.js")(sequelize, Sequelize);

db.room.belongsToMany(db.user, {
  through: "userRoom",
});
db.user.belongsToMany(db.room, {
  through: "userRoom",
});

db.avatar.belongsToMany(db.user, {
  through: "userAvatar",
});
db.user.belongsToMany(db.avatar, {
  through: "userAvatar",
});

// db.user.hasMany(db.player);
// db.player.belongsTo(db.user);

module.exports = db;

module.exports = db;
