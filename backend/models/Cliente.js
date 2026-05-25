const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Cliente = sequelize.define("Cliente", {
  id_cliente: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre_cliente: { type: DataTypes.STRING(150), allowNull: false },
  observaciones: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: "cliente", timestamps: false });

module.exports = Cliente;