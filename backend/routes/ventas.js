const router = require("express").Router();
const ctrl = require("../controllers/ventasController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { VIEW_SALES, MANAGE_SALES, MANAGE_SALES_DELETE } = require("../permissions");

router.get("/", requireAuth, requireRole(...VIEW_SALES), ctrl.getAll);
router.get("/:id", requireAuth, requireRole(...VIEW_SALES), ctrl.getOne);
router.post("/", requireAuth, requireRole(...MANAGE_SALES), ctrl.create);
router.delete("/:id", requireAuth, requireRole(...MANAGE_SALES_DELETE), ctrl.remove);

module.exports = router;
