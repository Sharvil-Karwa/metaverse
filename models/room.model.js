const roomSchema = (sequelize, Sequelize) => {
  const Room = sequelize.define("room", {
    name: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.STRING,
    },
  });
  return Room;
};

module.exports = roomSchema;
