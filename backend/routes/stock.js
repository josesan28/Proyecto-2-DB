const router = require("express").Router();
const ctrl = require("../controllers/stockController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { MANAGE_CATALOGS } = require("../permissions");

router.patch("/:id/stock", requireAuth, requireRole(...MANAGE_CATALOGS), ctrl.ajustar);

module.exports = router;
