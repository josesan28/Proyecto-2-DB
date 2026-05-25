const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Venta = sequelize.define("Venta", {
  id_venta: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_empleado: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  id_cliente: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  fecha_hora_venta: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, { tableName: "venta", timestamps: false });

module.exports = Venta;