const router = require("express").Router();
const ctrl = require("../controllers/empleadosController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

router.get("/", requireAuth, requireRole("gerente"), ctrl.getAll);
router.get("/:id", requireAuth, requireRole("gerente"), ctrl.getOne);
router.post("/", requireAuth, requireRole("admin"), ctrl.create);
router.put("/:id", requireAuth, requireRole("admin"), ctrl.update);
router.put("/:id/contrasena", requireAuth, requireRole("admin"), ctrl.updatePassword);
router.delete("/:id", requireAuth, requireRole("admin"), ctrl.remove);

module.exports = router;