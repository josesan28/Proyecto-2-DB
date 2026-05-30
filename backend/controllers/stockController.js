const pool = require("../db/pool");

exports.ajustar = async (req, res) => {
  const { cantidad } = req.body;
  const id = req.params.id;

  if (cantidad === undefined || cantidad === null)
    return res.status(400).json({ error: "cantidad es obligatoria" });

  const conn = await pool.getConnection();
  try {
    await conn.query("CALL sp_ajustar_stock(?, ?, @stock_nuevo, @error)", [id, cantidad]);
    const [[out]] = await conn.query(
      "SELECT @stock_nuevo AS stock_nuevo, @error AS error"
    );

    if (out.error)
      return res.status(400).json({ error: out.error });

    res.json({ stock_nuevo: out.stock_nuevo, message: "Stock ajustado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};