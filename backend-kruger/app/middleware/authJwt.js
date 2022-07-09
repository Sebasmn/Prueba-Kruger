const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No hay token de ingreso!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No autorizado!"
      });
    }
    req.userCard = decoded.card;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findByPk(req.userCard).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "administrador") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "No posees el rol de administrador!"
      });
      return;
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
isEmployee = (req, res, next) => {
  console.log(req.params.userCard)
  User.findByPk(req.userCard).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "empleado") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "No posees el rol de empleado!"
      });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });;
};
isEmployeeOrAdmin = (req, res, next) => {
  User.findByPk(req.userCard).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "empleado") {
          next();
          return;
        }
        if (roles[i].name === "administrador") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Se requiere el rol de administrador o moderador!"
      });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });;
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEmployee: isEmployee,
  isEmployeeOrAdmin: isEmployeeOrAdmin
};
module.exports = authJwt;