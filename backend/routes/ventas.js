const router = require("express").Router();
const ctrl = require("../controllers/ventasController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

router.get("/", requireAuth, requireRole("auditor"), ctrl.getAll);
router.get("/:id", requireAuth, requireRole("auditor"), ctrl.getOne);
router.post("/", requireAuth, requireRole("vendedor"), ctrl.create);
router.delete("/:id",requireAuth, requireRole("gerente"), ctrl.remove);

module.exports = router;