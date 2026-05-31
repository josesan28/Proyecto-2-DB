const router = require("express").Router();
const ctrl = require("../controllers/clientesController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { VIEW_CLIENTS, MANAGE_CLIENTS } = require("../permissions");

router.get("/", requireAuth, requireRole(...VIEW_CLIENTS), ctrl.getAll);
router.get("/:id", requireAuth, requireRole(...VIEW_CLIENTS), ctrl.getOne);
router.post("/", requireAuth, requireRole(...MANAGE_CLIENTS), ctrl.create);
router.put("/:id", requireAuth, requireRole(...MANAGE_CLIENTS), ctrl.update);
router.delete("/:id", requireAuth, requireRole(...MANAGE_CLIENTS), ctrl.remove);
router.post("/procedimiento", requireAuth, requireRole(...MANAGE_CLIENTS), ctrl.upsertPorProcedimiento);

module.exports = router;
