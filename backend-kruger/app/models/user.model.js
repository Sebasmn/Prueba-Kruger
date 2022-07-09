module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        card: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING,
            primaryKey: true
        },
        names: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        lastNames: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING,
        },
        username: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        password: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        bornDate: {
            allowNull: true,
            unique: true,
            type: Sequelize.DATEONLY,
        },
        direction: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        phone: {
            allowNull: true,
            unique: true,
            type: Sequelize.STRING,
        },
        vaccinated: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        type: {
            allowNull: true,
            type: Sequelize.STRING
        },
        vaccinatedDate: {
            allowNull: true,
            unique: true,
            type: Sequelize.DATEONLY,
        },
        doseNumber: {
            allowNull: true,
            unique: true,
            type: Sequelize.STRING,
        },
        
    });
    return User;
  };