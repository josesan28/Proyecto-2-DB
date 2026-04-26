require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");

const app = express();
app.use(cors());
app.use(express.json());

app.locals.db = pool;

app.get("/api/ping", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "pong" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
