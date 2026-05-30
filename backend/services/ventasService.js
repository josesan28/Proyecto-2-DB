const dao = require("../daos/ventasDao");
const pool = require("../db/pool");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const venta = await dao.findById(id);
  if (!venta) throw Object.assign(new Error("Venta no encontrada"), { status: 404 });
  return venta;
};

exports.create = async ({ id_empleado, id_cliente, items }) => {
  const conn = await pool.getConnection();
  try {
    const itemsJson = JSON.stringify(
      items.map((i) => ({
        id_producto: parseInt(i.id_producto),
        cantidad: parseInt(i.cantidad),
      }))
    );

    const [[result]] = await conn.query(
      "CALL sp_registrar_venta(?, ?, ?, @id_venta, @error)",
      [id_empleado, id_cliente ?? null, itemsJson]
    );

    const [[out]] = await conn.query(
      "SELECT @id_venta AS id_venta, @error AS error"
    );

    if (out.error) {
      const err = new Error(out.error);
      err.status = 400;
      throw err;
    }

    return { id_venta: out.id_venta, message: "Venta registrada correctamente" };
  } finally {
    conn.release();
  }
};

exports.remove = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("CALL sp_anular_venta(?, @error)", [id]);

    const [[out]] = await conn.query("SELECT @error AS error");

    if (out.error) {
      const err = new Error(out.error);
      err.status = out.error.includes("no encontrada") ? 404 : 400;
      throw err;
    }

    return { message: "Venta anulada y stock restaurado" };
  } finally {
    conn.release();
  }
};