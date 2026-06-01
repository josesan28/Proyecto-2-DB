const { Proveedor, TelefonoProveedor, CorreoProveedor } = require("../models");

const _include = [
  { model: TelefonoProveedor, as: "telefonos", attributes: ["telefono"] },
  { model: CorreoProveedor, as: "correos", attributes: ["correo"] },
];

const _format = (p) => ({
  ...p.toJSON(),
  telefonos: p.telefonos.map((t) => t.telefono),
  correos:   p.correos.map((c) => c.correo),
});

exports.findAll = async () => {
  const rows = await Proveedor.findAll({ include: _include, order: [["id_proveedor", "ASC"]] });
  return rows.map(_format);
};

exports.findById = async (id) => {
  const p = await Proveedor.findByPk(id, { include: _include });
  return p ? _format(p) : null;
};

exports.insert = async ({ nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] }) => {
  const { sequelize } = require("../models");
  return sequelize.transaction(async (t) => {
    const prov = await Proveedor.create(
      { nombre_proveedor, direccion_proveedor: direccion_proveedor ?? null },
      { transaction: t }
    );
    const id = prov.id_proveedor;
    await TelefonoProveedor.bulkCreate(
      telefonos.map((telefono) => ({ id_proveedor: id, telefono })),
      { transaction: t }
    );
    await CorreoProveedor.bulkCreate(
      correos.map((correo) => ({ id_proveedor: id, correo })),
      { transaction: t }
    );
    return { id_proveedor: id };
  });
};

exports.update = async (id, { nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] }) => {
  const { sequelize } = require("../models");
  const existing = await Proveedor.findByPk(id);
  if (!existing) return 0;

  return sequelize.transaction(async (t) => {
    await Proveedor.update(
      { nombre_proveedor, direccion_proveedor: direccion_proveedor ?? null },
      { where: { id_proveedor: id }, transaction: t }
    );
    await TelefonoProveedor.destroy({ where: { id_proveedor: id }, transaction: t });
    await CorreoProveedor.destroy({   where: { id_proveedor: id }, transaction: t });
    await TelefonoProveedor.bulkCreate(
      telefonos.map((telefono) => ({ id_proveedor: id, telefono })),
      { transaction: t }
    );
    await CorreoProveedor.bulkCreate(
      correos.map((correo) => ({ id_proveedor: id, correo })),
      { transaction: t }
    );
    return 1;
  });
};

exports.remove = async (id) =>
  Proveedor.destroy({ where: { id_proveedor: id } });