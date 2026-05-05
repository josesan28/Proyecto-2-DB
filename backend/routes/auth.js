const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, contrasena } = req.body;
  if (!username || !contrasena)
    return res.status(400).json({ error: "username y contrasena son obligatorios" });

  try {
    const [rows] = await pool.query(
      `SELECT id_empleado, nombre_empleado, username, hash_contrasena, cargo, estado
       FROM empleado WHERE username = ?`,
      [username]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const empleado = rows[0];

    if (empleado.estado === "inactivo")
      return res.status(403).json({ error: "Empleado inactivo, acceso denegado" });

    const match = await bcrypt.compare(contrasena, empleado.hash_contrasena);
    if (!match)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      {
        id_empleado: empleado.id_empleado,
        username: empleado.username,
        nombre_empleado: empleado.nombre_empleado,
        cargo: empleado.cargo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, nombre_empleado: empleado.nombre_empleado, cargo: empleado.cargo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ message: "Sesión cerrada" });
});

module.exports = router;