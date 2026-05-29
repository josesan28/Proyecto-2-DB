const router = require("express").Router();
const ctrl = require("../controllers/clientesController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

router.get("/", requireAuth, requireRole("auditor"), ctrl.getAll);
router.get("/:id", requireAuth, requireRole("auditor"), ctrl.getOne);
router.post("/", requireAuth, requireRole("vendedor"), ctrl.create);
router.put("/:id", requireAuth, requireRole("vendedor"), ctrl.update);
router.delete("/:id",requireAuth, requireRole("gerente"), ctrl.remove);

module.exports = router;