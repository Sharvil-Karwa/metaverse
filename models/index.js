const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
console.log(config);
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
  logging: false,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.avatar = require("../models/avatar.model.js")(sequelize, Sequelize);

db.user.hasMany(db.avatar);
db.user.hasMany(db.room);
db.room.hasMany(db.avatar);

module.exports = db;
