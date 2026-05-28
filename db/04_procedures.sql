-- Stored Procedures

USE tienda_db;

DELIMITER $$

-- Procedimiento 1: Registrar venta completa
CREATE PROCEDURE sp_registrar_venta(
  IN p_id_empleado INT,
  IN p_id_cliente INT,
  IN p_items JSON,
  OUT p_id_venta INT,
  OUT p_error VARCHAR(255)
)
BEGIN
  DECLARE v_total       DECIMAL(12,2) DEFAULT 0;
  DECLARE v_precio      DECIMAL(10,2);
  DECLARE v_stock       INT;
  DECLARE v_subtotal    DECIMAL(12,2);
  DECLARE v_i           INT DEFAULT 0;
  DECLARE v_n           INT;
  DECLARE v_id_producto INT;
  DECLARE v_cantidad    INT;
  DECLARE v_empleado    INT;
  DECLARE exit_handler  BOOLEAN DEFAULT FALSE;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET exit_handler = TRUE;
    ROLLBACK;
    SET p_id_venta = NULL;
    SET p_error = 'Error interno al registrar la venta';
  END;

  SET p_id_venta = NULL;
  SET p_error = NULL;

  -- Validar empleado activo
  SELECT id_empleado INTO v_empleado
  FROM empleado
  WHERE id_empleado = p_id_empleado AND estado = 'activo'
  LIMIT 1;

  IF v_empleado IS NULL THEN
    SET p_error = 'Empleado no encontrado o inactivo';
    LEAVE sp_registrar_venta;
  END IF;

  START TRANSACTION;

  SET v_n = JSON_LENGTH(p_items);

  -- Validar stock de todos los items antes de insertar
  WHILE v_i < v_n DO
    SET v_id_producto = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', v_i, '].id_producto')));
    SET v_cantidad = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', v_i, '].cantidad')));

    SELECT precio_venta, stock_actual
    INTO v_precio, v_stock
    FROM producto
    WHERE id_producto = v_id_producto
    FOR UPDATE;

    IF v_stock IS NULL THEN
      ROLLBACK;
      SET p_error = CONCAT('Producto ', v_id_producto, ' no encontrado');
      LEAVE sp_registrar_venta;
    END IF;

    IF v_stock < v_cantidad THEN
      ROLLBACK;
      SET p_error = CONCAT('Stock insuficiente para producto ', v_id_producto,
                           '. Disponible: ', v_stock);
      LEAVE sp_registrar_venta;
    END IF;

    SET v_subtotal = ROUND(v_precio * v_cantidad, 2);
    SET v_total = v_total + v_subtotal;
    SET v_i = v_i + 1;
  END WHILE;

  -- Insertar venta
  INSERT INTO venta (id_empleado, id_cliente, total)
  VALUES (p_id_empleado, p_id_cliente, ROUND(v_total, 2));

  SET p_id_venta = LAST_INSERT_ID();

  -- Insertar detalle y decrementar stock
  SET v_i = 0;
  WHILE v_i < v_n DO
    SET v_id_producto = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', v_i, '].id_producto')));
    SET v_cantidad = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', v_i, '].cantidad')));

    SELECT precio_venta INTO v_precio
    FROM   producto WHERE id_producto = v_id_producto;

    SET v_subtotal = ROUND(v_precio * v_cantidad, 2);

    INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
    VALUES (p_id_venta, v_id_producto, v_cantidad, v_precio, v_subtotal);

    UPDATE producto
    SET stock_actual = stock_actual - v_cantidad
    WHERE id_producto = v_id_producto;

    SET v_i = v_i + 1;
  END WHILE;

  COMMIT;
END$$

-- Procedimiento 2: Anular venta
CREATE PROCEDURE sp_anular_venta(
  IN  p_id_venta INT,
  OUT p_error    VARCHAR(255)
)
BEGIN
  DECLARE v_existe INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_error = 'Error interno al anular la venta';
  END;

  SET p_error = NULL;

  SELECT COUNT(*) INTO v_existe FROM venta WHERE id_venta = p_id_venta;

  IF v_existe = 0 THEN
    SET p_error = 'Venta no encontrada';
    LEAVE sp_anular_venta;
  END IF;

  START TRANSACTION;

  -- Restaurar stock
  UPDATE producto p
  JOIN   detalle_venta dv ON p.id_producto = dv.id_producto
  SET    p.stock_actual   = p.stock_actual + dv.cantidad
  WHERE  dv.id_venta      = p_id_venta;

  DELETE FROM venta WHERE id_venta = p_id_venta;

  COMMIT;
END$$

-- Procedimiento 3: Ajustar stock de un producto
CREATE PROCEDURE sp_ajustar_stock(
  IN  p_id_producto INT,
  IN  p_cantidad    INT,
  OUT p_stock_nuevo INT,
  OUT p_error VARCHAR(255)
)
BEGIN
  DECLARE v_stock_actual INT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_error = 'Error interno al ajustar stock';
  END;

  SET p_error = NULL;
  SET p_stock_nuevo = NULL;

  SELECT stock_actual INTO v_stock_actual
  FROM producto WHERE id_producto = p_id_producto;

  IF v_stock_actual IS NULL THEN
    SET p_error = 'Producto no encontrado';
    LEAVE sp_ajustar_stock;
  END IF;

  IF v_stock_actual + p_cantidad < 0 THEN
    SET p_error = CONCAT('Stock insuficiente. Actual: ', v_stock_actual);
    LEAVE sp_ajustar_stock;
  END IF;

  START TRANSACTION;

  UPDATE producto
  SET    stock_actual = stock_actual + p_cantidad
  WHERE  id_producto  = p_id_producto;

  SELECT stock_actual INTO p_stock_nuevo
  FROM   producto WHERE id_producto = p_id_producto;

  COMMIT;
END$$

-- Procedimiento 4: Crear o actualizar cliente
CREATE PROCEDURE sp_upsert_cliente(
  IN  p_id_cliente INT,
  IN  p_nombre VARCHAR(150),
  IN  p_observaciones VARCHAR(500),
  OUT p_result_id INT,
  OUT p_error VARCHAR(255)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_error = 'Error interno al guardar cliente';
  END;

  SET p_error = NULL;

  IF p_nombre IS NULL OR p_nombre = '' THEN
    SET p_error = 'nombre_cliente es obligatorio';
    LEAVE sp_upsert_cliente;
  END IF;

  START TRANSACTION;

  IF p_id_cliente IS NULL OR p_id_cliente = 0 THEN
    INSERT INTO cliente (nombre_cliente, observaciones)
    VALUES (p_nombre, p_observaciones);
    SET p_result_id = LAST_INSERT_ID();
  ELSE
    UPDATE cliente
    SET    nombre_cliente = p_nombre,
           observaciones  = p_observaciones
    WHERE  id_cliente     = p_id_cliente;
    SET p_result_id = p_id_cliente;
  END IF;

  COMMIT;
END$$

-- Procedimiento 5: Reporte de ventas por rango de fechas
CREATE PROCEDURE sp_reporte_ventas_periodo(
  IN p_fecha_inicio DATE,
  IN p_fecha_fin    DATE
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SELECT 'Error al generar reporte' AS error;
  END;

  IF p_fecha_inicio IS NULL THEN
    SET p_fecha_inicio = DATE_SUB(CURDATE(), INTERVAL 30 DAY);
  END IF;
  IF p_fecha_fin IS NULL THEN
    SET p_fecha_fin = CURDATE();
  END IF;

  SELECT
    v.id_venta,
    DATE(v.fecha_hora_venta) AS fecha,
    e.nombre_empleado,
    COALESCE(c.nombre_cliente, 'Consumidor final') AS cliente,
    v.total,
    COUNT(dv.id_detalle_venta) AS num_productos
  FROM venta v
  JOIN empleado e ON v.id_empleado = e.id_empleado
  LEFT JOIN cliente c ON v.id_cliente  = c.id_cliente
  JOIN  detalle_venta dv ON dv.id_venta = v.id_venta
  WHERE DATE(v.fecha_hora_venta) BETWEEN p_fecha_inicio AND p_fecha_fin
  GROUP BY v.id_venta, fecha, e.nombre_empleado, cliente, v.total
  ORDER BY fecha DESC;
END$$

DELIMITER ;