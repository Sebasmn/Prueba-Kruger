const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    define: {
        underscored: true,
        freezeTableName: true,
        timestamps: false,
    },
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.user_roles = require("../models/user_roles.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: db.user_roles,
  foreignKey: "roleId",
  otherKey: "userCard"
});
db.user.belongsToMany(db.role, {
  through: db.user_roles,
  foreignKey: "userCard",
  otherKey: "roleId"
});
db.ROLES = ["administrador", "empleado"];
module.exports = db;