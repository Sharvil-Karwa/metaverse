module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("room", {
    roomname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Room;
};
