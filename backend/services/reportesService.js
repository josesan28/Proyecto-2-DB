const dao = require("../daos/reportesDao");

exports.productosDetalle = () => dao.productosDetalle();
exports.ventasCompletas = () => dao.ventasCompletas();
exports.detalleVentas = () => dao.detalleVentas();
exports.clientesConVentas = () => dao.clientesConVentas();
exports.empleadosSobrePromedioCargo = () => dao.empleadosSobrePromedioCargo();
exports.ventasPorCategoria = () => dao.ventasPorCategoria();
exports.ventasPorEmpleado = () => dao.ventasPorEmpleado();
exports.productosMasVendidos = () => dao.productosMasVendidos();
exports.rankingClientes = () => dao.rankingClientes();