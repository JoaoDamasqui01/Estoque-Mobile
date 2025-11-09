const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("coffe_shop_system", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    port: 3306, // porta padrão do MySQL
    logging: false // opcional: remove logs SQL no console
});

module.exports = sequelize;