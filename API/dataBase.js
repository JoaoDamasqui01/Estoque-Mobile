const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("coffe", "root", "Senac@123", {
    host: "localhost",
    dialect: "mysql",
    port: 3307, // porta padrão do MySQL
    logging: false // opcional: remove logs SQL no console
});
module.exports = sequelize;