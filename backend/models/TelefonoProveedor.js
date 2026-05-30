const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TelefonoProveedor = sequelize.define("TelefonoProveedor", {
  id_telefono_proveedor: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
}, { tableName: "telefono_proveedor", timestamps: false });

module.exports = TelefonoProveedor;