const router = require("express").Router();
const ctrl = require("../controllers/reportesController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const auth = [requireAuth, requireRole("auditor")];

router.get("/productos-detalle", ...auth, ctrl.productosDetalle);
router.get("/ventas-completas", ...auth, ctrl.ventasCompletas);
router.get("/detalle-ventas", ...auth, ctrl.detalleVentas);
router.get("/clientes-con-ventas", ...auth, ctrl.clientesConVentas);
router.get("/empleados-sobre-promedio-cargo", ...auth, ctrl.empleadosSobrePromedioCargo);
router.get("/ventas-por-categoria", ...auth, ctrl.ventasPorCategoria);
router.get("/ventas-por-empleado", ...auth, ctrl.ventasPorEmpleado);
router.get("/productos-mas-vendidos", ...auth, ctrl.productosMasVendidos);
router.get("/ranking-clientes", ...auth, ctrl.rankingClientes);

module.exports = router;