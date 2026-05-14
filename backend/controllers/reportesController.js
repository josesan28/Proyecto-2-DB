const service = require("../services/reportesService");

const wrap = (fn) => async (req, res) => {
  try { res.json(await fn()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.productosDetalle = wrap(() => service.productosDetalle());
exports.ventasCompletas = wrap(() => service.ventasCompletas());
exports.detalleVentas = wrap(() => service.detalleVentas());
exports.clientesConVentas = wrap(() => service.clientesConVentas());
exports.empleadosSobrePromedioCargo = wrap(() => service.empleadosSobrePromedioCargo());
exports.ventasPorCategoria = wrap(() => service.ventasPorCategoria());
exports.ventasPorEmpleado = wrap(() => service.ventasPorEmpleado());
exports.productosMasVendidos = wrap(() => service.productosMasVendidos());
exports.rankingClientes = wrap(() => service.rankingClientes());