const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const DetalleVenta = sequelize.define("DetalleVenta", {
  id_detalle_venta: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_venta: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, { tableName: "detalle_venta", timestamps: false });

module.exports = DetalleVenta;