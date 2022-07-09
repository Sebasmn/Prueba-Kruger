module.exports = (sequelize, Sequelize) => {
  const User_roles = sequelize.define("user_roles", {
    roleId: {
      type: Sequelize.INTEGER,
    },
    userCard: {
      type: Sequelize.INTEGER,
    },
  });
  return User_roles;
};
