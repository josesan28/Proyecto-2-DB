const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Producto = sequelize.define("Producto", {
  id_producto: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  id_categoria: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  nombre_producto: { type: DataTypes.STRING(150), allowNull: false },
  descripcion_producto: { type: DataTypes.STRING(500), allowNull: false },
  precio_compra: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  precio_venta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock_actual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: "producto", timestamps: false });

module.exports = Producto;