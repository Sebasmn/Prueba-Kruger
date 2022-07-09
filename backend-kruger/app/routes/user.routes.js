const { authJwt } = require("../middleware");
const verifyCreateUser = require("../middleware/verifyCreateUser");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isEmployee],
    controller.moderatorBoard
  );
  // Obtener todos los usuarios
  app.get("/api/getAllUsers", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);

   // Obtener las informacion y roles que tiene un usuario por su cedula
   app.get("/api/getUserByCard/:card", [authJwt.verifyToken, authJwt.isEmployeeOrAdmin], controller.getUserByCard);
   
   // Actualizar usuario por su cedula
   app.put("/api/updateUserByCard/:card", [authJwt.verifyToken, authJwt.isEmployeeOrAdmin],  controller.updateUser);
   
   // Eliminar usuario por id
   app.delete("/api/deleteUserByCard/:card", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

   // Crea usuario
  app.post(
    "/api/createUser",
    [verifyCreateUser.checkDuplicateCardOrEmail, verifyCreateUser.checkRolesExisted],
    controller.createUser
  );
};