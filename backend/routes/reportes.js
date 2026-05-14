const router = require("express").Router();
const ctrl = require("../controllers/reportesController");

router.get("/productos-detalle", ctrl.productosDetalle);
router.get("/ventas-completas", ctrl.ventasCompletas);
router.get("/detalle-ventas", ctrl.detalleVentas);
router.get("/clientes-con-ventas", ctrl.clientesConVentas);
router.get("/empleados-sobre-promedio-cargo", ctrl.empleadosSobrePromedioCargo);
router.get("/ventas-por-categoria", ctrl.ventasPorCategoria);
router.get("/ventas-por-empleado", ctrl.ventasPorEmpleado);
router.get("/productos-mas-vendidos", ctrl.productosMasVendidos);
router.get("/ranking-clientes", ctrl.rankingClientes);

module.exports = router;