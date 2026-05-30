const router = require("express").Router();
const ctrl = require("../controllers/stockController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

router.patch("/:id/stock", requireAuth, requireRole("bodeguero"), ctrl.ajustar);

module.exports = router;