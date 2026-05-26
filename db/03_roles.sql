--  Roles y permisos en el DBMS

USE tienda_db;

-- Crear roles
CREATE ROLE IF NOT EXISTS 'rol_admin';
CREATE ROLE IF NOT EXISTS 'rol_gerente';
CREATE ROLE IF NOT EXISTS 'rol_vendedor';
CREATE ROLE IF NOT EXISTS 'rol_bodeguero';
CREATE ROLE IF NOT EXISTS 'rol_auditor';

-- Permisos por rol

-- Administrador: control total
GRANT ALL PRIVILEGES ON tienda_db.* TO 'rol_admin';

-- Gerente: todo menos eliminar empleados o modificar roles
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.categoria TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.proveedor TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.telefono_proveedor TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.correo_proveedor TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.producto TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.cliente TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.telefono_cliente TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.correo_cliente TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.venta TO 'rol_gerente';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.detalle_venta TO 'rol_gerente';
GRANT SELECT ON tienda_db.empleado TO 'rol_gerente';
GRANT SELECT ON tienda_db.telefono_empleado TO 'rol_gerente';
GRANT SELECT ON tienda_db.correo_empleado TO 'rol_gerente';
GRANT SELECT ON tienda_db.vista_ventas_por_categoria TO 'rol_gerente';

-- Vendedor: registrar ventas y consultar productos y clientes
GRANT SELECT ON tienda_db.producto TO 'rol_vendedor';
GRANT SELECT ON tienda_db.categoria TO 'rol_vendedor';
GRANT SELECT ON tienda_db.proveedor TO 'rol_vendedor';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.cliente TO 'rol_vendedor';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.telefono_cliente TO 'rol_vendedor';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.correo_cliente TO 'rol_vendedor';
GRANT SELECT, INSERT ON tienda_db.venta TO 'rol_vendedor';
GRANT SELECT, INSERT ON tienda_db.detalle_venta TO 'rol_vendedor';
GRANT SELECT ON tienda_db.empleado TO 'rol_vendedor';
GRANT SELECT ON tienda_db.vista_ventas_por_categoria TO 'rol_vendedor';

-- Bodeguero: gestión de productos y stock, sin acceso a ventas ni empleados
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.producto TO 'rol_bodeguero';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.categoria TO 'rol_bodeguero';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.proveedor TO 'rol_bodeguero';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.telefono_proveedor TO 'rol_bodeguero';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_db.correo_proveedor TO 'rol_bodeguero';
GRANT SELECT ON tienda_db.vista_ventas_por_categoria TO 'rol_bodeguero';

-- Auditor: solo lectura de todo
GRANT SELECT ON tienda_db.categoria TO 'rol_auditor';
GRANT SELECT ON tienda_db.proveedor TO 'rol_auditor';
GRANT SELECT ON tienda_db.telefono_proveedor TO 'rol_auditor';
GRANT SELECT ON tienda_db.correo_proveedor TO 'rol_auditor';
GRANT SELECT ON tienda_db.producto TO 'rol_auditor';
GRANT SELECT ON tienda_db.cliente TO 'rol_auditor';
GRANT SELECT ON tienda_db.telefono_cliente TO 'rol_auditor';
GRANT SELECT ON tienda_db.correo_cliente TO 'rol_auditor';
GRANT SELECT ON tienda_db.empleado TO 'rol_auditor';
GRANT SELECT ON tienda_db.telefono_empleado TO 'rol_auditor';
GRANT SELECT ON tienda_db.correo_empleado TO 'rol_auditor';
GRANT SELECT ON tienda_db.venta TO 'rol_auditor';
GRANT SELECT ON tienda_db.detalle_venta TO 'rol_auditor';
GRANT SELECT ON tienda_db.vista_ventas_por_categoria TO 'rol_auditor';

-- Usuarios de prueba
CREATE USER IF NOT EXISTS 'u_admin'@'%' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'u_gerente'@'%' IDENTIFIED BY 'gerente123';
CREATE USER IF NOT EXISTS 'u_vendedor'@'%' IDENTIFIED BY 'vendedor123';
CREATE USER IF NOT EXISTS 'u_bodeguero'@'%' IDENTIFIED BY 'bodeguero123';
CREATE USER IF NOT EXISTS 'u_auditor'@'%' IDENTIFIED BY 'auditor123';

GRANT 'rol_admin' TO 'u_admin'@'%';
GRANT 'rol_gerente' TO 'u_gerente'@'%';
GRANT 'rol_vendedor' TO 'u_vendedor'@'%';
GRANT 'rol_bodeguero' TO 'u_bodeguero'@'%';
GRANT 'rol_auditor' TO 'u_auditor'@'%';

SET DEFAULT ROLE 'rol_admin' TO 'u_admin'@'%';
SET DEFAULT ROLE 'rol_gerente' TO 'u_gerente'@'%';
SET DEFAULT ROLE 'rol_vendedor' TO 'u_vendedor'@'%';
SET DEFAULT ROLE 'rol_bodeguero' TO 'u_bodeguero'@'%';
SET DEFAULT ROLE 'rol_auditor' TO 'u_auditor'@'%';

FLUSH PRIVILEGES;