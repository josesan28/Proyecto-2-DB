const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CorreoEmpleado = sequelize.define("CorreoEmpleado", {
  id_correo: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_empleado: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false },
}, { tableName: "correo_empleado", timestamps: false });

module.exports = CorreoEmpleado;