const { Cliente, TelefonoCliente, CorreoCliente } = require("../models");

const _include = [
  { model: TelefonoCliente, as: "telefonos", attributes: ["numero"] },
  { model: CorreoCliente, as: "correos", attributes: ["correo"] },
];

const _format = (c) => ({
  ...c.toJSON(),
  telefonos: c.telefonos.map((t) => t.numero),
  correos: c.correos.map((r) => r.correo),
});

exports.findAll = async () => {
  const rows = await Cliente.findAll({ include: _include, order: [["nombre_cliente", "ASC"]] });
  return rows.map(_format);
};

exports.findById = async (id) => {
  const c = await Cliente.findByPk(id, { include: _include });
  return c ? _format(c) : null;
};

exports.insert = async ({ nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const { sequelize } = require("../models");
  return sequelize.transaction(async (t) => {
    const cliente = await Cliente.create(
      { nombre_cliente, observaciones: observaciones ?? null },
      { transaction: t }
    );
    const id = cliente.id_cliente;
    await TelefonoCliente.bulkCreate(
      telefonos.map((numero) => ({ id_cliente: id, numero })),
      { transaction: t }
    );
    await CorreoCliente.bulkCreate(
      correos.map((correo) => ({ id_cliente: id, correo })),
      { transaction: t }
    );
    return { id_cliente: id };
  });
};

exports.update = async (id, { nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const { sequelize } = require("../models");
  return sequelize.transaction(async (t) => {
    const existing = await Cliente.findByPk(id, { transaction: t });
    if (!existing) return 0;

    await Cliente.update(
      { nombre_cliente, observaciones: observaciones ?? null },
      { where: { id_cliente: id }, transaction: t }
    );
    await TelefonoCliente.destroy({ where: { id_cliente: id }, transaction: t });
    await CorreoCliente.destroy({   where: { id_cliente: id }, transaction: t });
    await TelefonoCliente.bulkCreate(
      telefonos.map((numero) => ({ id_cliente: id, numero })),
      { transaction: t }
    );
    await CorreoCliente.bulkCreate(
      correos.map((correo) => ({ id_cliente: id, correo })),
      { transaction: t }
    );
    return 1;
  });
};

exports.remove = async (id) =>
  Cliente.destroy({ where: { id_cliente: id } });
