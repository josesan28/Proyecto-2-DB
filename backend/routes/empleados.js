const router = require("express").Router();
const ctrl = require("../controllers/empleadosController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { VIEW_EMPLOYEES, EMPLOYEES_ADMIN, EMPLOYEES_DELETE } = require("../permissions");

router.get("/", requireAuth, requireRole(...VIEW_EMPLOYEES), ctrl.getAll);
router.get("/:id", requireAuth, requireRole(...VIEW_EMPLOYEES), ctrl.getOne);
router.post("/", requireAuth, requireRole(...EMPLOYEES_ADMIN), ctrl.create);
router.put("/:id", requireAuth, requireRole(...EMPLOYEES_ADMIN), ctrl.update);
router.put("/:id/contrasena", requireAuth, requireRole(...EMPLOYEES_ADMIN), ctrl.updatePassword);
router.delete("/:id", requireAuth, requireRole(...EMPLOYEES_DELETE), ctrl.remove);

module.exports = router;
