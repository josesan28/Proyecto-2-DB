const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CorreoCliente = sequelize.define("CorreoCliente", {
  id_correo_cliente: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false },
}, { tableName: "correo_cliente", timestamps: false });

module.exports = CorreoCliente;