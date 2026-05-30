const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TelefonoEmpleado = sequelize.define("TelefonoEmpleado", {
  id_telefono: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_empleado: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
}, { tableName: "telefono_empleado", timestamps: false });

module.exports = TelefonoEmpleado;