const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "correopruebakgr@gmail.com",
    pass: "iwjkdlhypcqtfvjr",
  },
});

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

/**
 * Obtiene la informacion de todos los usuarios
 * @param {*} req
 * @param {*} res
 */
 exports.getAllUsers = (req, res) => {
  User.findAll({
    include: [
      {
        model: Role,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * Obtiene la informacion de un usuario por su cedula
 * @param {*} req
 * @param {*} res
 */
 exports.getUserByCard = (req, res) => {
  const userCard = req.params.card;
  User.findOne({
    where: { card: userCard },
    include: [
      {
        model: Role,
      },
    ],
  })
    .then((data) => {
      res.send(data); 
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `No se pudo encontrar los roles del usuario con cédula = ${userCard}.`,
      });
    });
};

/**
 * Crea un usuario y le envia un correo electrónico con las credenciales de acceso
 * @param {*} req
 * @param {*} res
 */

exports.createUser = (req, res) => {
  // Save User to Database
  const userCard = req.body.card;
  const userNames = req.body.names;
  const userLastNames = req.body.lastNames;
  const userEmail = req.body.email;
  User.create({
    card: userCard,
    names: userNames,
    lastNames: userLastNames,
    email: userEmail,
    // password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            var credentials = sendGmailMessage(userCard, userEmail);
            var userWithCredentials = {
              card: userCard,
              names: userNames,
              lastNames: userLastNames,
              email: userEmail,
              username: credentials[0],
              password: bcrypt.hashSync(credentials[1], 8),
            }
            User.findOne({
              where: {
                card: userCard,
              }
            }).then((user) => {
              user.update(userWithCredentials)
            });
            res.send({ message: "El usuario fue creado correctamente!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([2]).then(() => {
        var credentials = sendGmailMessage(userCard, userEmail);
        var userWithCredentials = {
          card: userCard,
          names: userNames,
          lastNames: userLastNames,
          email: userEmail,
          username: credentials[0],
          password: bcrypt.hashSync(credentials[1], 8),
        }
        User.findOne({
          where: {
            card: userCard,
          }
        }).then((user) => {
          user.update(userWithCredentials)
        });
         res.send({ message: "El usuario fue creado correctamente!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

/**
 * Actualiza un usuario
 * @param {*} req
 * @param {*} res
 */
 exports.updateUser = (req, res) => {
  // Validar petición
  const userCard = req.params.card;

    const userData = {
      names: req.body.names,
      lastNames: req.body.lastNames,
      email: req.body.email,
      bornDate: req.body.bornDate,
      direction: req.body.direction,
      phone: req.body.phone,
      vaccinated: req.body.vaccinated,
      type: req.body.type,
      vaccinatedDate: req.body.vaccinatedDate,
      doseNumber: req.body.doseNumber
    };
    
    User.update(userData, {
      where: { card: userCard },
    })
      .then((num) => {
        if (num = 1) {
          res.send({
            message: "El usuario fue actualizado correctamente.",
          });
        } else {
          res.send({
            message: "No se pudo actualizar el usuario",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message
        });
      });
};

/**
 * Elimina un usuario
 * @param {*} req
 * @param {*} res
 */
 exports.deleteUser = (req, res) => {
  const card = req.params.card;
  User.destroy({
    where: { card: card },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El usuario fue eliminado correctamente!",
        });
      } else {
        res.send({
          message: `No se puede eliminar el usuario con la id=${id}. Puede que el usuario no funcione!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede eliminar el usuario con la id=" + id,
      });
    });
};


function sendGmailMessage(userCard, userEmail) {
  var credentials = createUsernamePassword(userCard);
  const messageToSend =
    "Hola estimado usuario tus credenciales de acceso son: Usuario: " +
    credentials[0] +
    " , Contraseña: " +
    credentials[1];
  const mailData = {
    from: "correopruebakgr@gmail.com", // sender address
    to: userEmail, // list of receivers
    subject: "Tu cuenta ha sido creada exitosamente",
    text: messageToSend,
    html: "<b>Hola usuario! </b> <br> Estas son tus credenciales de acceso: <br/> Usuario: " + credentials[0] + ", Contraseña: " + credentials[1],
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info)
    }
  });
  return credentials
}

function createUsernamePassword(card) {
  var credentials = [];
  var username = "";
  var password = "";
  var secretKey = "kruger";
  username = secretKey + "-" + card;
  var cardAux = card + secretKey;
  var array = cardAux.split("");
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  password = array.join("");
  credentials.push(username);
  credentials.push(password);
  return credentials;
}
