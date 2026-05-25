const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Empleado = sequelize.define("Empleado", {
  id_empleado: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre_empleado: { type: DataTypes.STRING(150), allowNull: false },
  username: { type: DataTypes.STRING(60), allowNull: true },
  hash_contrasena: { type: DataTypes.STRING(255), allowNull: true },
  cargo: { type: DataTypes.STRING(100), allowNull: true },
  fecha_contratacion: { type: DataTypes.DATEONLY, allowNull: true },
  estado: { type: DataTypes.ENUM("activo", "inactivo"), allowNull: false, defaultValue: "activo" },
}, { tableName: "empleado", timestamps: false });

module.exports = Empleado;