const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Proveedor = sequelize.define("Proveedor", {
  id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre_proveedor: { type: DataTypes.STRING(150), allowNull: false },
  direccion_proveedor: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: "proveedor", timestamps: false });

module.exports = Proveedor;