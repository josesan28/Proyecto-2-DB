const service = require("../services/authService");

exports.login = async (req, res) => {
  const { username, contrasena } = req.body;
  if (!username || !contrasena)
    return res.status(400).json({ error: "username y contrasena son obligatorios" });
  try {
    res.json(await service.login({ username, contrasena }));
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Sesión cerrada" });
};