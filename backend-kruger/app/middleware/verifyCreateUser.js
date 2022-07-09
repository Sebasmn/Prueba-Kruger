const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateCardOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      card: req.body.card,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "La cédula ingresada ya se encuentra en uso!",
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "El correo electrónico ya esta en uso!",
        });
        return;
      }
      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "El rol no existe " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifyCreateUser = {
  checkDuplicateCardOrEmail: checkDuplicateCardOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifyCreateUser;
