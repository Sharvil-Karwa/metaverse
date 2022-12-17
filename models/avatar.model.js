const avatarSchema = (sequelize, Sequelize) => {
  const Avatar = sequelize.define("avatar", {
    name: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.STRING,
    },
  });
  return Avatar;
};

module.exports = avatarSchema;
