module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("room", {
    roomname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    owner_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Room;
};
