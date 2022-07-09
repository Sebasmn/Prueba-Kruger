const express = require("express");
const cors = require("cors");
const app = express();
// URL permitidas para que se conecten a nuestro servidor
var corsOptions = {
  origin: "http://localhost:4200"
};
// Habilitamos cors
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
const Role = db.role;

// Método para producción
db.sequelize.sync();

// Método para desarrollo
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Bd eliminada y reestrablecida.");
//   createRoles();
// });

function createRoles() {
    Role.create({
      name: "administrador"
    });
   
    Role.create({
      name: "empleado"
    });
  
  }

// Ruta inicial
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al api rest de kruger." });
});

// Llamamos a nuestras rutas creadas
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// Configuramos el puerto dle servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}.`);
});
