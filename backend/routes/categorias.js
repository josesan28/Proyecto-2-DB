const router = require("express").Router();
const ctrl = require("../controllers/categoriasController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

router.get("/", requireAuth, requireRole("auditor"), ctrl.getAll);
router.get("/:id", requireAuth, requireRole("auditor"), ctrl.getOne);
router.post("/", requireAuth, requireRole("bodeguero"), ctrl.create);
router.put("/:id", requireAuth, requireRole("bodeguero"), ctrl.update);
router.delete("/:id", requireAuth, requireRole("gerente"), ctrl.remove);

module.exports = router;