const { DataTypes } = require("sequelize");
const sequelize = require("../dataBase");

const Ingrediente = sequelize.define("Ingredientes", {

    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unidade_medida: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fornecedor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ponto_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preco_custo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    localizacao:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

module.exports = Ingrediente;