const router = require("express").Router();
const ctrl = require("../controllers/productosController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { VIEW_PRODUCTS, MANAGE_CATALOGS } = require("../permissions");

router.get("/", requireAuth, requireRole(...VIEW_PRODUCTS), ctrl.getAll);
router.get("/:id", requireAuth, requireRole(...VIEW_PRODUCTS), ctrl.getOne);
router.post("/", requireAuth, requireRole(...MANAGE_CATALOGS), ctrl.create);
router.put("/:id", requireAuth, requireRole(...MANAGE_CATALOGS), ctrl.update);
router.delete("/:id", requireAuth, requireRole(...MANAGE_CATALOGS), ctrl.remove);

module.exports = router;
