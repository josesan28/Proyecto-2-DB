const pool = require("../db/pool");
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

exports.ventasPorPeriodo = async (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    const [[rango]] = await pool.query(`
      SELECT
        MIN(DATE(fecha_hora_venta)) AS fecha_inicio,
        MAX(DATE(fecha_hora_venta)) AS fecha_fin
      FROM venta
    `);

    fechaInicio = fechaInicio ?? rango?.fecha_inicio ?? null;
    fechaFin = fechaFin ?? rango?.fecha_fin ?? null;
  }

  const [rows] = await pool.query("CALL sp_reporte_ventas_periodo(?, ?)", [
    fechaInicio ?? null,
    fechaFin ?? null,
  ]);

  return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
};