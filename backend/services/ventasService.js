const dao = require("../daos/ventasDao");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const venta = await dao.findById(id);
  if (!venta) throw Object.assign(new Error("Venta no encontrada"), { status: 404 });
  return venta;
};

exports.create = async ({ id_empleado, id_cliente, items }) => {
  const pool = dao.getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const empleado = await dao.findEmpleadoActivo(conn, id_empleado);
    if (!empleado) {
      await conn.rollback();
      throw Object.assign(new Error("Empleado no encontrado o inactivo"), { status: 400 });
    }

    const lineas = [];
    let total = 0;

    for (const item of items) {
      const prod = await dao.findProductoForSale(conn, item.id_producto);
      if (!prod) {
        await conn.rollback();
        throw Object.assign(
          new Error(`Producto ${item.id_producto} no encontrado`), { status: 404 }
        );
      }
      if (prod.stock_actual < item.cantidad) {
        await conn.rollback();
        throw Object.assign(
          new Error(`Stock insuficiente para "${prod.nombre_producto}". Disponible: ${prod.stock_actual}`),
          { status: 400 }
        );
      }
      const subtotal = parseFloat((prod.precio_venta * item.cantidad).toFixed(2));
      total += subtotal;
      lineas.push({ ...prod, cantidad: item.cantidad, subtotal });
    }

    total = parseFloat(total.toFixed(2));

    const id_venta = await dao.insertVenta(conn, { id_empleado, id_cliente, total });

    for (const linea of lineas) {
      await dao.insertDetalle(conn, {
        id_venta,
        id_producto: linea.id_producto,
        cantidad: linea.cantidad,
        precio_unitario: linea.precio_venta,
        subtotal: linea.subtotal,
      });
      await dao.decrementStock(conn, linea.id_producto, linea.cantidad);
    }

    await conn.commit();
    return { id_venta, total, message: "Venta registrada correctamente" };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.remove = async (id) => {
  const pool = dao.getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const venta = await dao.findById(id);
    if (!venta) {
      await conn.rollback();
      throw Object.assign(new Error("Venta no encontrada"), { status: 404 });
    }

    const detalle = await dao.findDetalleByVenta(conn, id);
    for (const linea of detalle) {
      await dao.incrementStock(conn, linea.id_producto, linea.cantidad);
    }
    await dao.deleteVenta(conn, id);

    await conn.commit();
    return { message: "Venta anulada y stock restaurado" };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};