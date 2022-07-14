module.exports = (sequelize, Sequelize) => {
  const Avatar = sequelize.define("avatar", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Avatar;
};
