require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");

const app = express();
app.use(express.json());

const normalizeOrigin = (value) => value.replace(/\/+$/, "");
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
      .map(normalizeOrigin)
  : ["http://localhost:5174"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado: ${origin}`);
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true
}));

app.get("/api/ping", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "pong" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/empleados", require("./routes/empleados"));
app.use("/api/ventas", require("./routes/ventas"));
app.use("/api/reportes", require("./routes/reportes"));

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));