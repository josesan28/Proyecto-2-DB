const router = require("express").Router();
const ctrl = require("../controllers/empleadosController");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.put("/:id/contrasena", ctrl.updatePassword);
router.delete("/:id", ctrl.remove);

module.exports = router;