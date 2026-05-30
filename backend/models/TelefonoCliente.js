const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TelefonoCliente = sequelize.define("TelefonoCliente", {
  id_telefono_cliente: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  numero: { type: DataTypes.STRING(20), allowNull: false },
}, { tableName: "telefono_cliente", timestamps: false });

module.exports = TelefonoCliente;