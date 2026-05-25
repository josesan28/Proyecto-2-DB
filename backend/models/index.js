const sequelize = require("../db/sequelize");
const Categoria = require("./Categoria");
const Proveedor = require("./Proveedor");
const Producto = require("./Producto");
const Cliente = require("./Cliente");
const Empleado = require("./Empleado");
const Venta = require("./Venta");
const DetalleVenta = require("./DetalleVenta");

// Asociaciones
Categoria.hasMany(Producto, { foreignKey: "id_categoria" });
Producto.belongsTo(Categoria, { foreignKey: "id_categoria" });

Proveedor.hasMany(Producto, { foreignKey: "id_proveedor" });
Producto.belongsTo(Proveedor, { foreignKey: "id_proveedor" });

Empleado.hasMany(Venta, { foreignKey: "id_empleado" });
Venta.belongsTo(Empleado, { foreignKey: "id_empleado" });

Cliente.hasMany(Venta, { foreignKey: "id_cliente" });
Venta.belongsTo(Cliente, { foreignKey: "id_cliente" });

Venta.hasMany(DetalleVenta, { foreignKey: "id_venta" });
DetalleVenta.belongsTo(Venta, { foreignKey: "id_venta" });

Producto.hasMany(DetalleVenta, { foreignKey: "id_producto" });
DetalleVenta.belongsTo(Producto, { foreignKey: "id_producto" });

module.exports = { sequelize, Categoria, Proveedor, Producto, Cliente, Empleado, Venta, DetalleVenta };