const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CorreoProveedor = sequelize.define("CorreoProveedor", {
  id_correo_proveedor: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false },
}, { tableName: "correo_proveedor", timestamps: false });

module.exports = CorreoProveedor;