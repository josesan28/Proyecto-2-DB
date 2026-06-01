const pool = require("../db/pool");
const dao = require("../daos/clientesDao");

const firstRow = async (conn, sql, params = []) => {
  const [rows] = await conn.query(sql, params);
  return Array.isArray(rows) ? rows[0] : rows;
};

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const cliente = await dao.findById(id);
  if (!cliente) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return cliente;
};

exports.create = async (data) => {
  const { id_cliente } = await dao.insert(data);
  return { id_cliente, message: "Cliente creado" };
};

exports.update = async (id, data) => {
  const affected = await dao.update(id, data);
  if (!affected) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return { message: "Cliente actualizado" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return { message: "Cliente eliminado" };
};

exports.upsertPorProcedimiento = async ({ id_cliente, nombre_cliente, observaciones }) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "CALL sp_upsert_cliente(?, ?, ?, @result_id, @error)",
      [id_cliente ?? null, nombre_cliente, observaciones ?? null]
    );

    const out = await firstRow(conn, "SELECT @result_id AS result_id, @error AS error");

    if (out.error) {
      const err = new Error(out.error);
      err.status = 400;
      throw err;
    }

    return {
      id_cliente: out.result_id,
      message: id_cliente ? "Cliente actualizado" : "Cliente creado",
    };
  } finally {
    conn.release();
  }
};
