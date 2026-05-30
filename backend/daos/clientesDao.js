const { Cliente } = require("../models");
const pool = require("../db/pool");

const _fetchContactos = async (id) => {
  const [telefonos] = await pool.query(
    "SELECT numero FROM telefono_cliente WHERE id_cliente = ?", [id]
  );
  const [correos] = await pool.query(
    "SELECT correo FROM correo_cliente WHERE id_cliente = ?", [id]
  );
  return {
    telefonos: telefonos.map((t) => t.numero),
    correos: correos.map((c) => c.correo),
  };
};

exports.findAll = async () => {
  const clientes = await Cliente.findAll({ order: [["nombre_cliente", "ASC"]] });
  const result = [];
  for (const c of clientes) {
    const contactos = await _fetchContactos(c.id_cliente);
    result.push({ ...c.toJSON(), ...contactos });
  }
  return result;
};

exports.findById = async (id) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return null;
  const contactos = await _fetchContactos(id);
  return { ...cliente.toJSON(), ...contactos };
};

exports.insert = async ({ nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const cliente = await Cliente.create({
      nombre_cliente,
      observaciones: observaciones ?? null,
    });
    const id = cliente.id_cliente;

    for (const numero of telefonos)
      await conn.query(
        "INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)", [id, numero]
      );
    for (const correo of correos)
      await conn.query(
        "INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)", [id, correo]
      );

    await conn.commit();
    return { id_cliente: id };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.update = async (id, { nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [affected] = await Cliente.update(
      { nombre_cliente, observaciones: observaciones ?? null },
      { where: { id_cliente: id } }
    );
    if (!affected) { await conn.rollback(); return 0; }

    await conn.query("DELETE FROM telefono_cliente WHERE id_cliente = ?", [id]);
    await conn.query("DELETE FROM correo_cliente   WHERE id_cliente = ?", [id]);
    for (const numero of telefonos)
      await conn.query(
        "INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)", [id, numero]
      );
    for (const correo of correos)
      await conn.query(
        "INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)", [id, correo]
      );

    await conn.commit();
    return affected;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.remove = async (id) =>
  Cliente.destroy({ where: { id_cliente: id } });