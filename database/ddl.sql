--  Proyecto 2 - Bases de Datos 1
--  DDL - MySQL


CREATE DATABASE IF NOT EXISTS tienda_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tienda_db;

-- CATEGORÍA
CREATE TABLE Categoria (
    id_categoria       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre_categoria   VARCHAR(100)    NOT NULL,
    descripcion_categoria VARCHAR(255) NULL,
    CONSTRAINT pk_categoria PRIMARY KEY (id_categoria),
    CONSTRAINT uq_categoria_nombre UNIQUE (nombre_categoria)
);

-- PROVEEDOR
CREATE TABLE Proveedor (
    id_proveedor       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre_proveedor   VARCHAR(150)    NOT NULL,
    direccion_proveedor VARCHAR(255)   NULL,
    CONSTRAINT pk_proveedor PRIMARY KEY (id_proveedor)
);

-- TELÉFONO PROVEEDOR
CREATE TABLE TelefonoProveedor (
    id_telefono_proveedor INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_proveedor          INT UNSIGNED NOT NULL,
    telefono              VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_telefono_proveedor PRIMARY KEY (id_telefono_proveedor),
    CONSTRAINT fk_telprv_proveedor   FOREIGN KEY (id_proveedor)
        REFERENCES Proveedor (id_proveedor)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- CORREO PROVEEDOR 
CREATE TABLE CorreoProveedor (
    id_correo_proveedor INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    id_proveedor        INT UNSIGNED  NOT NULL,
    correo              VARCHAR(150)  NOT NULL,
    CONSTRAINT pk_correo_proveedor PRIMARY KEY (id_correo_proveedor),
    CONSTRAINT fk_corprv_proveedor  FOREIGN KEY (id_proveedor)
        REFERENCES Proveedor (id_proveedor)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_correo_proveedor  UNIQUE (correo)
);

-- PRODUCTO
CREATE TABLE Producto (
    id_producto          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_categoria         INT UNSIGNED     NOT NULL,
    id_proveedor         INT UNSIGNED     NOT NULL,
    nombre_producto      VARCHAR(150)     NOT NULL,
    descripcion_producto VARCHAR(500)     NOT NULL,
    precio_compra        DECIMAL(10,2)    NOT NULL,
    precio_venta         DECIMAL(10,2)    NOT NULL,
    stock_actual         INT              NOT NULL DEFAULT 0,
    CONSTRAINT pk_producto           PRIMARY KEY (id_producto),
    CONSTRAINT uq_producto_desc      UNIQUE (descripcion_producto),
    CONSTRAINT fk_prod_categoria     FOREIGN KEY (id_categoria)
        REFERENCES Categoria (id_categoria)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_prod_proveedor     FOREIGN KEY (id_proveedor)
        REFERENCES Proveedor (id_proveedor)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_precio_compra     CHECK (precio_compra > 0),
    CONSTRAINT chk_precio_venta      CHECK (precio_venta > 0),
    CONSTRAINT chk_stock_actual      CHECK (stock_actual >= 0)
);

-- EMPLEADO
CREATE TABLE Empleado (
    id_empleado        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre_empleado    VARCHAR(150)    NOT NULL,
    username           VARCHAR(60)     NULL,
    hash_contrasena    VARCHAR(255)    NULL,
    cargo              VARCHAR(100)    NULL,
    fecha_contratacion DATE            NULL,
    estado             ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT pk_empleado   PRIMARY KEY (id_empleado),
    CONSTRAINT uq_emp_username UNIQUE (username)
);

-- TELÉFONO EMPLEADO 
CREATE TABLE TelefonoEmpleado (
    id_telefono  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_empleado  INT UNSIGNED NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_telefono_empleado PRIMARY KEY (id_telefono),
    CONSTRAINT fk_telemp_empleado   FOREIGN KEY (id_empleado)
        REFERENCES Empleado (id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- CORREO EMPLEADO  (multivaluado)
CREATE TABLE CorreoEmpleado (
    id_correo    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    id_empleado  INT UNSIGNED  NOT NULL,
    correo       VARCHAR(150)  NOT NULL,
    CONSTRAINT pk_correo_empleado  PRIMARY KEY (id_correo),
    CONSTRAINT fk_coremp_empleado  FOREIGN KEY (id_empleado)
        REFERENCES Empleado (id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_correo_empleado  UNIQUE (correo)
);

-- CLIENTE
CREATE TABLE Cliente (
    id_cliente      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre_cliente  VARCHAR(150)    NOT NULL,
    observaciones   VARCHAR(500)    NULL,
    CONSTRAINT pk_cliente PRIMARY KEY (id_cliente)
);

-- TELÉFONO CLIENTE 
CREATE TABLE TelefonoCliente (
    id_telefono_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente          INT UNSIGNED NOT NULL,
    numero              VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_telefono_cliente PRIMARY KEY (id_telefono_cliente),
    CONSTRAINT fk_telcli_cliente   FOREIGN KEY (id_cliente)
        REFERENCES Cliente (id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- CORREO CLIENTE 
CREATE TABLE CorreoCliente (
    id_correo_cliente INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    id_cliente        INT UNSIGNED  NOT NULL,
    correo            VARCHAR(150)  NOT NULL,
    CONSTRAINT pk_correo_cliente  PRIMARY KEY (id_correo_cliente),
    CONSTRAINT fk_corcli_cliente  FOREIGN KEY (id_cliente)
        REFERENCES Cliente (id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_correo_cliente  UNIQUE (correo)
);

-- VENTA
CREATE TABLE Venta (
    id_venta        INT UNSIGNED       NOT NULL AUTO_INCREMENT,
    id_empleado     INT UNSIGNED       NOT NULL,
    id_cliente      INT UNSIGNED       NULL,
    fecha_hora_venta DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total           DECIMAL(12,2)      NOT NULL,
    CONSTRAINT pk_venta          PRIMARY KEY (id_venta),
    CONSTRAINT fk_venta_empleado FOREIGN KEY (id_empleado)
        REFERENCES Empleado (id_empleado)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_venta_cliente  FOREIGN KEY (id_cliente)
        REFERENCES Cliente (id_cliente)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_venta_total   CHECK (total >= 0)
);

-- DETALLE VENTA
CREATE TABLE DetalleVenta (
    id_detalle_venta INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_venta         INT UNSIGNED     NOT NULL,
    id_producto      INT UNSIGNED     NOT NULL,
    cantidad         INT              NOT NULL,
    precio_unitario  DECIMAL(10,2)    NOT NULL,
    subtotal         DECIMAL(12,2)    NOT NULL,
    CONSTRAINT pk_detalle_venta      PRIMARY KEY (id_detalle_venta),
    CONSTRAINT fk_det_venta          FOREIGN KEY (id_venta)
        REFERENCES Venta (id_venta)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_det_producto       FOREIGN KEY (id_producto)
        REFERENCES Producto (id_producto)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_det_cantidad      CHECK (cantidad > 0),
    CONSTRAINT chk_det_precio_unit   CHECK (precio_unitario > 0),
    CONSTRAINT chk_det_subtotal      CHECK (subtotal > 0)
);