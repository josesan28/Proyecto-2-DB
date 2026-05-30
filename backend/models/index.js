const sequelize = require("../db/sequelize");

const Categoria = require("./Categoria");
const Proveedor = require("./Proveedor");
const TelefonoProveedor = require("./TelefonoProveedor");
const CorreoProveedor = require("./CorreoProveedor");
const Producto = require("./Producto");
const Cliente = require("./Cliente");
const TelefonoCliente = require("./TelefonoCliente");
const CorreoCliente = require("./CorreoCliente");
const Empleado = require("./Empleado");
const TelefonoEmpleado = require("./TelefonoEmpleado");
const CorreoEmpleado = require("./CorreoEmpleado");
const Venta = require("./Venta");
const DetalleVenta = require("./DetalleVenta");

// Producto
Categoria.hasMany(Producto, { foreignKey: "id_categoria" });
Producto.belongsTo(Categoria, { foreignKey: "id_categoria" });
Proveedor.hasMany(Producto, { foreignKey: "id_proveedor" });
Producto.belongsTo(Proveedor, { foreignKey: "id_proveedor" });

// Contactos proveedor
Proveedor.hasMany(TelefonoProveedor, { foreignKey: "id_proveedor", as: "telefonos" });
TelefonoProveedor.belongsTo(Proveedor, { foreignKey: "id_proveedor" });
Proveedor.hasMany(CorreoProveedor, { foreignKey: "id_proveedor", as: "correos" });
CorreoProveedor.belongsTo(Proveedor, { foreignKey: "id_proveedor" });

// Contactos cliente
Cliente.hasMany(TelefonoCliente, { foreignKey: "id_cliente", as: "telefonos" });
TelefonoCliente.belongsTo(Cliente, { foreignKey: "id_cliente" });
Cliente.hasMany(CorreoCliente, { foreignKey: "id_cliente", as: "correos" });
CorreoCliente.belongsTo(Cliente, { foreignKey: "id_cliente" });

// Contactos empleado
Empleado.hasMany(TelefonoEmpleado, { foreignKey: "id_empleado", as: "telefonos" });
TelefonoEmpleado.belongsTo(Empleado, { foreignKey: "id_empleado" });
Empleado.hasMany(CorreoEmpleado, { foreignKey: "id_empleado", as: "correos" });
CorreoEmpleado.belongsTo(Empleado, { foreignKey: "id_empleado" });

// Venta
Empleado.hasMany(Venta, { foreignKey: "id_empleado" });
Venta.belongsTo(Empleado, { foreignKey: "id_empleado" });
Cliente.hasMany(Venta, { foreignKey: "id_cliente" });
Venta.belongsTo(Cliente, { foreignKey: "id_cliente" });
Venta.hasMany(DetalleVenta, { foreignKey: "id_venta" });
DetalleVenta.belongsTo(Venta, { foreignKey: "id_venta" });
Producto.hasMany(DetalleVenta, { foreignKey: "id_producto" });
DetalleVenta.belongsTo(Producto, { foreignKey: "id_producto" });

module.exports = {
  sequelize,
  Categoria, Proveedor, TelefonoProveedor, CorreoProveedor,
  Producto, Cliente, TelefonoCliente, CorreoCliente,
  Empleado, TelefonoEmpleado, CorreoEmpleado,
  Venta, DetalleVenta,
};