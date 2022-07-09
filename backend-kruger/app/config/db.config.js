// base de datos online
module.exports = {
  HOST: "5.181.218.103",
  USER: "u179925486_kruger",
  PASSWORD: "Kruger123",
  DB: "u179925486_kruger",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// base de datos local
/*
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "kruger",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
*/