--  Proyecto 2 - Script de datos de prueba

USE tienda_db;

-- CATEGORÍAS
INSERT INTO Categoria (nombre_categoria, descripcion_categoria) VALUES
('Electrónica',          'Dispositivos electrónicos y accesorios tecnológicos'),
('Computación',          'Equipos de cómputo, periféricos y componentes'),
('Telefonía',            'Teléfonos móviles, accesorios y repuestos'),
('Papelería',            'Útiles de oficina, papel y artículos escolares'),
('Hogar',                'Artículos para el hogar y decoración'),
('Iluminación',          'Focos, lámparas y sistemas de iluminación'),
('Herramientas',         'Herramientas manuales y eléctricas'),
('Audio y Video',        'Equipos de sonido, TV y streaming'),
('Gaming',               'Videojuegos, consolas y accesorios gamer'),
('Redes y Conectividad', 'Routers, switches, cables y equipos de red');


-- PROVEEDORES
INSERT INTO Proveedor (nombre_proveedor, direccion_proveedor) VALUES
('TechDistrib S.A.',        '5a Av. 10-23, Zona 1, Ciudad de Guatemala'),
('ElectroImport Ltda.',     '18 Calle 5-67, Zona 12, Ciudad de Guatemala'),
('MegaSupplies Corp.',      '2a Calle 3-40, Zona 4, Ciudad de Guatemala'),
('OffiPro Guatemala',       'Boulevard Los Próceres 14-72, Zona 10'),
('Global Tech GUA',         '7a Av. 6-19, Zona 9, Ciudad de Guatemala'),
('Distribuidora Nextel',    'Calzada Roosevelt 22-10, Zona 7'),
('AudioMark S.A.',          '12 Calle 1-25, Zona 10, Ciudad de Guatemala'),
('GamerZone Import',        '4a Calle 8-33, Zona 11, Ciudad de Guatemala'),
('NetConnect Gt.',          '9a Av. 15-44, Zona 6, Ciudad de Guatemala'),
('HomePlus Distribuidores', 'Calzada Aguilar Batres 30-56, Zona 12');

-- Teléfonos de proveedores
INSERT INTO TelefonoProveedor (id_proveedor, telefono) VALUES
(1,'2250-1100'),(1,'5501-2233'),
(2,'2260-4400'),(2,'4455-6677'),
(3,'2270-8800'),(3,'5588-9900'),
(4,'2280-3300'),(4,'3311-4422'),
(5,'2290-5500'),(5,'5544-3322'),
(6,'2291-6600'),(6,'4422-1133'),
(7,'2292-7700'),(7,'5566-7788'),
(8,'2293-8800'),(8,'4477-8899'),
(9,'2294-9900'),(9,'5599-0011'),
(10,'2295-0000'),(10,'4400-1122');

-- Correos de proveedores
INSERT INTO CorreoProveedor (id_proveedor, correo) VALUES
(1,'ventas@techdistrib.com.gt'),
(2,'info@electroimport.com.gt'),
(3,'pedidos@megasupplies.com.gt'),
(4,'comercial@offipro.com.gt'),
(5,'contacto@globaltech.com.gt'),
(6,'ventas@nextelgt.com'),
(7,'info@audiomark.com.gt'),
(8,'ventas@gamerzone.com.gt'),
(9,'soporte@netconnect.com.gt'),
(10,'ventas@homeplus.com.gt');

-- EMPLEADOS
INSERT INTO Empleado (nombre_empleado, username, hash_contrasena, cargo, fecha_contratacion, estado) VALUES
('Carlos Mendoza Pérez',    'carlos.mendoza',  '$2b$12$abc1234567890ABCDEFGHIJ', 'Gerente General',    '2018-03-15', 'activo'),
('Ana Lucía Rodríguez',     'ana.rodriguez',   '$2b$12$def1234567890ABCDEFGHIJ', 'Jefe de Ventas',     '2019-07-01', 'activo'),
('Diego Fuentes López',     'diego.fuentes',   '$2b$12$ghi1234567890ABCDEFGHIJ', 'Vendedor',           '2020-01-10', 'activo'),
('María José García',       'maria.garcia',    '$2b$12$jkl1234567890ABCDEFGHIJ', 'Vendedora',          '2020-06-20', 'activo'),
('Luis Fernando Torres',    'luis.torres',     '$2b$12$mno1234567890ABCDEFGHIJ', 'Cajero',             '2021-02-14', 'activo'),
('Sofía Hernández Ruiz',    'sofia.hernandez', '$2b$12$pqr1234567890ABCDEFGHIJ', 'Cajera',             '2021-09-03', 'activo'),
('Roberto Castillo Vega',   'roberto.castillo','$2b$12$stu1234567890ABCDEFGHIJ', 'Bodeguero',          '2022-04-18', 'activo'),
('Gabriela Morales Soto',   'gabriela.morales','$2b$12$vwx1234567890ABCDEFGHIJ', 'Atención al Cliente','2022-11-07', 'activo'),
('José Ramírez Aguilar',    'jose.ramirez',    '$2b$12$yza1234567890ABCDEFGHIJ', 'Vendedor',           '2023-05-22', 'activo'),
('Valeria Ortiz Chan',      'valeria.ortiz',   '$2b$12$yzb1234567890ABCDEFGHIJ', 'Asistente',          '2024-01-08', 'inactivo');

-- Teléfonos de empleados
INSERT INTO TelefonoEmpleado (id_empleado, telefono) VALUES
(1,'5100-0001'),(2,'5100-0002'),(3,'5100-0003'),(4,'5100-0004'),(5,'5100-0005'),
(6,'5100-0006'),(7,'5100-0007'),(8,'5100-0008'),(9,'5100-0009'),(10,'5100-0010');

-- Correos de empleados
INSERT INTO CorreoEmpleado (id_empleado, correo) VALUES
(1,'carlos.mendoza@tienda.com'),
(2,'ana.rodriguez@tienda.com'),
(3,'diego.fuentes@tienda.com'),
(4,'maria.garcia@tienda.com'),
(5,'luis.torres@tienda.com'),
(6,'sofia.hernandez@tienda.com'),
(7,'roberto.castillo@tienda.com'),
(8,'gabriela.morales@tienda.com'),
(9,'jose.ramirez@tienda.com'),
(10,'valeria.ortiz@tienda.com');


-- CLIENTES 
INSERT INTO Cliente (nombre_cliente, observaciones) VALUES
('Juan Pablo Alvarado',     'Cliente frecuente, prefiere pago en efectivo'),
('Sandra Patricia Lima',    NULL),
('Fernando Estrada Ruiz',   'Empresa: Estrada & Asociados'),
('Karla Beatriz Sánchez',   NULL),
('Marco Antonio Pérez',     'Solicita factura a nombre de empresa'),
('Isabel Cristina Vega',    NULL),
('Andrés Roberto Méndez',   'Cliente mayorista'),
('Lucía Fernanda Castro',   NULL),
('Pablo Javier Morales',    'Requiere entrega a domicilio'),
('Elena Sofía López',       NULL),
('Ricardo David González',  NULL),
('Patricia Alejandra Ruiz', 'Cliente frecuente'),
('Alejandro Enrique Torres',NULL),
('Natalia Beatriz Flores',  NULL),
('Sergio Antonio Reyes',    'Empresa: Reyes Tech S.A.'),
('Claudia Marina Ortiz',    NULL),
('Emilio José Herrera',     NULL),
('Daniela Valentina Cruz',  'Cliente nueva, referida'),
('Gustavo Adolfo Ramírez',  NULL),
('Rosa Elena Monzón',       NULL),
('Héctor Miguel Barrios',   'Cliente mayorista'),
('Wendy Paola Juárez',      NULL),
('José Luis Chávez',        'Empresa: Chávez Importaciones'),
('Miriam Andrea García',    NULL),
('Óscar Fernando Díaz',     NULL),
('Beatriz Helena Palma',    NULL),
('Kevin Alexander Ríos',    'Gamer frecuente'),
('Viviana Marcela Ponce',   NULL),
('Eduardo Samuel Vásquez',  NULL),
('Rosario Concepción León', NULL);

-- Teléfonos de clientes
INSERT INTO TelefonoCliente (id_cliente, numero) VALUES
(1,'5200-0001'),(2,'5200-0002'),(3,'5200-0003'),(4,'5200-0004'),(5,'5200-0005'),
(6,'5200-0006'),(7,'5200-0007'),(8,'5200-0008'),(9,'5200-0009'),(10,'5200-0010'),
(11,'5200-0011'),(12,'5200-0012'),(13,'5200-0013'),(14,'5200-0014'),(15,'5200-0015'),
(16,'5200-0016'),(17,'5200-0017'),(18,'5200-0018'),(19,'5200-0019'),(20,'5200-0020'),
(21,'5200-0021'),(22,'5200-0022'),(23,'5200-0023'),(24,'5200-0024'),(25,'5200-0025'),
(26,'5200-0026'),(27,'5200-0027'),(28,'5200-0028'),(29,'5200-0029'),(30,'5200-0030');

-- Correos de clientes
INSERT INTO CorreoCliente (id_cliente, correo) VALUES
(1,'jalvarado@gmail.com'),(2,'sandra.lima@hotmail.com'),(3,'festrada@estrada.com.gt'),
(4,'karla.sanchez@gmail.com'),(5,'maperez@empresa.com.gt'),(6,'i.vega@outlook.com'),
(7,'amendez@mayorista.com'),(8,'luciaf.castro@gmail.com'),(9,'pablo.morales@gmail.com'),
(10,'elopez@gmail.com'),(11,'ricardogonzalez@hotmail.com'),(12,'patriruiz@gmail.com'),
(13,'atorres@outlook.com'),(14,'nflores@gmail.com'),(15,'reyes@reyestech.com.gt'),
(16,'claudia.ortiz@gmail.com'),(17,'emilio.herrera@hotmail.com'),(18,'daniela.cruz@gmail.com'),
(19,'gramire@outlook.com'),(20,'rosa.monzon@gmail.com');

-- PRODUCTOS  (30)
INSERT INTO Producto (id_categoria, id_proveedor, nombre_producto, descripcion_producto,
                      precio_compra, precio_venta, stock_actual) VALUES
-- Electrónica (1)
(1,1,'Cargador USB-C 65W',        'Cargador rápido USB-C 65 W compatible con laptops y móviles',     85.00,  149.99,  80),
(1,1,'Adaptador HDMI a VGA',      'Adaptador HDMI macho a VGA hembra, Full HD',                       35.00,   69.99, 120),
(1,2,'Batería portátil 20000mAh', 'Power bank 20 000 mAh con carga rápida 18 W',                    180.00,  299.99,  45),
-- Computación (2)
(2,2,'Memoria RAM DDR4 8GB',      'Módulo RAM DDR4 8 GB 3200 MHz para escritorio',                   195.00,  349.99,  60),
(2,2,'SSD SATA 480GB',            'Disco sólido SATA III 480 GB 2.5 pulgadas',                       280.00,  479.99,  35),
(2,1,'Teclado mecánico RGB',      'Teclado mecánico con switches azules e iluminación RGB',           350.00,  599.99,  25),
(2,3,'Mouse inalámbrico 1600dpi', 'Mouse inalámbrico con receptor USB, 1600 dpi, 3 botones',          75.00,  149.99,  90),
(2,3,'Mousepad XL Gaming',        'Mousepad extra grande 80x30 cm con base antideslizante',            55.00,   99.99,  70),
-- Telefonía (3)
(3,5,'Cable USB-C 2m',            'Cable USB-C a USB-A trenzado de nylon, 2 metros, carga 3A',        25.00,   49.99, 200),
(3,5,'Protector pantalla 6.5"',   'Vidrio templado 9H para pantallas de 6.5 pulgadas',                18.00,   39.99, 300),
(3,6,'Audífonos TWS Bluetooth',   'Audífonos inalámbricos true wireless con estuche de carga 400mAh', 220.00,  399.99,  50),
-- Papelería (4)
(4,4,'Resma papel bond T/Carta',  'Resma papel bond 75gr tamaño carta 500 hojas marca Pro',           45.00,   79.99, 150),
(4,4,'Bolígrafo azul caja x12',   'Caja de 12 bolígrafos punta fina tinta azul',                       8.00,   17.99, 400),
(4,4,'Folder manila T/Carta x50', 'Paquete de 50 folders manila tamaño carta',                        28.00,   54.99, 180),
-- Hogar (5)
(5,10,'Multiplugs 6 tomas',       'Regleta de 6 tomas con protector de voltaje y cable 1.8 m',        90.00,  169.99,  65),
(5,10,'Ventilador de mesa 16"',   'Ventilador de mesa 16 pulgadas 3 velocidades, 45 W',              220.00,  389.99,  30),
-- Iluminación (6)
(6,10,'Foco LED 9W E27',          'Foco LED 9 W base E27, luz blanca 6500K, equivalente 60 W',        12.00,   24.99, 500),
(6,10,'Tira LED 5m RGB',          'Tira LED RGB 5 metros con control remoto y adaptador 12V',          95.00,  179.99,  40),
-- Herramientas (7)
(7,3,'Destornillador set x8',     'Set de 8 destornilladores Phillips y planos con mangos ergonómicos',55.00,   99.99,  55),
(7,3,'Cinta métrica 5m',          'Cinta métrica 5 metros con freno automático y carcasa resistente',  22.00,   44.99, 100),
-- Audio y Video (8)
(8,7,'Bocina Bluetooth 10W',      'Bocina portátil Bluetooth 5.0, 10 W, resistente al agua IPX5',    195.00,  349.99,  38),
(8,7,'Audífonos Over-Ear HiFi',   'Audífonos cerrados Over-Ear con cable desmontable, driver 40mm',   280.00,  499.99,  20),
-- Gaming (9)
(9,8,'Control Xbox Series USB',   'Control compatible Xbox Series X/S con conexión USB-C para PC',   350.00,  599.99,  15),
(9,8,'Silla gaming ergonómica',   'Silla gaming con soporte lumbar, reposabrazos 4D y reclinable',  1800.00, 2999.99,   8),
(9,8,'Headset gaming 7.1',        'Diadema gaming surround 7.1 virtual, micrófono retráctil, USB',    280.00,  499.99,  22),
-- Redes y Conectividad (10)
(10,9,'Router WiFi 6 AX1800',     'Router dual band WiFi 6 1800 Mbps, 4 antenas, MU-MIMO',          450.00,  799.99,  18),
(10,9,'Switch 8 puertos 1Gbps',   'Switch no administrable 8 puertos Gigabit Ethernet',             220.00,  399.99,  25),
(10,9,'Cable UTP Cat6 por metro', 'Cable UTP Cat6 sin blindaje, certificado, venta por metro',         4.50,    9.99, 800),
(10,9,'Patch cord Cat6 1m',       'Patch cord Cat6 armado con conectores RJ45 booted, 1 metro',        9.00,   19.99, 200),
(10,1,'Hub USB 3.0 x4',           'Hub USB 3.0 de 4 puertos con indicadores LED, cable 50cm',         65.00,  124.99,  60);

-- VENTAS 
INSERT INTO Venta (id_empleado, id_cliente, fecha_hora_venta, total) VALUES
(3,  1,  '2026-01-05 09:15:00',  599.98),
(4,  2,  '2026-01-07 10:30:00',  349.99),
(3,  3,  '2026-01-10 11:00:00', 1049.98),
(5,  4,  '2026-01-12 14:20:00',  219.97),
(6,  5,  '2026-01-15 09:45:00', 2999.99),
(3,  6,  '2026-01-18 16:10:00',  499.98),
(4,  7,  '2026-01-20 13:00:00', 1799.96),
(9,  8,  '2026-01-22 10:15:00',  169.99),
(3,  9,  '2026-01-25 15:30:00',  799.99),
(5,  10, '2026-01-28 11:45:00',  249.97),
(6,  11, '2026-02-02 09:00:00',  599.99),
(4,  12, '2026-02-05 14:30:00',  389.99),
(3,  13, '2026-02-08 10:00:00',  149.99),
(9,  14, '2026-02-10 16:45:00',  699.98),
(5,  15, '2026-02-12 11:15:00', 1199.98),
(6,  16, '2026-02-14 09:30:00',   89.98),
(3,  17, '2026-02-17 13:20:00',  479.99),
(4,  18, '2026-02-19 15:00:00',  349.99),
(9,  19, '2026-02-22 10:45:00',  899.98),
(5,  20, '2026-02-25 14:00:00',  124.99),
(6,  21, '2026-03-01 09:15:00', 3599.98),
(3,  22, '2026-03-04 11:30:00',  199.98),
(4,  23, '2026-03-07 14:15:00',  799.99),
(9,  24, '2026-03-10 16:00:00',  299.98),
(5,  25, '2026-03-13 10:30:00',  549.99),
(6,  26, '2026-03-16 13:00:00',  124.98),
(3,  27, '2026-03-19 15:45:00', 1099.98),
(4,  28, '2026-03-22 09:00:00',  399.99),
(9,  NULL,'2026-03-25 11:15:00',  74.97),
(5,  30, '2026-03-28 14:30:00',  349.99);

-- DETALLE VENTA 
INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
-- Venta 1
(1, 6, 1, 599.99, 599.99),
-- Venta 2
(2, 4, 1, 349.99, 349.99),
-- Venta 3
(3, 5, 1, 479.99, 479.99),
(3, 6, 1, 599.99, 599.99),
-- Venta 4
(4, 13,3,  17.99,  53.97),
(4, 12,2,  79.99, 159.98),
-- Venta 5
(5, 24,1,2999.99,2999.99),
-- Venta 6
(6, 11,1, 399.99, 399.99),
(6, 9, 2,  49.99,  99.98),
-- Venta 7
(7, 4, 2, 349.99, 699.98),
(7, 7, 2, 149.99, 299.98),
(7, 8, 8,  99.99, 799.92),
-- Venta 8
(8, 15,1, 169.99, 169.99),
-- Venta 9
(9, 26,1, 799.99, 799.99),
-- Venta 10
(10,10,5,  39.99, 199.95),
(10,9, 1,  49.99,  49.99),
-- Venta 11
(11,23,1, 599.99, 599.99),
-- Venta 12
(12,16,1, 389.99, 389.99),
-- Venta 13
(13,1, 1, 149.99, 149.99),
-- Venta 14
(14,21,2, 349.99, 699.98),
-- Venta 15
(15,26,1, 799.99, 799.99),
(15,27,1, 399.99, 399.99),
-- Venta 16
(16,13,5,  17.99,  89.95),
-- Venta 17
(17,5, 1, 479.99, 479.99),
-- Venta 18
(18,4, 1, 349.99, 349.99),
-- Venta 19
(19,22,1, 499.99, 499.99),
(19,11,1, 399.99, 399.99),
-- Venta 20
(20,30,1, 124.99, 124.99),
-- Venta 21
(21,24,1,2999.99,2999.99),
(21,25,1, 499.99, 499.99),
-- Venta 22
(22,17,4,  24.99,  99.96),
(22,9, 2,  49.99,  99.98),
-- Venta 23
(23,26,1, 799.99, 799.99),
-- Venta 24
(24,7, 2, 149.99, 299.98),
-- Venta 25
(25,25,1, 499.99, 499.99),
(25,1, 1, 149.99, 149.99),
-- Venta 26
(26,2, 1,  69.99,  69.99),
(26,9, 1,  49.99,  49.99),
-- Venta 27
(27,23,1, 599.99, 599.99),
(27,11,1, 399.99, 399.99),
-- Venta 28
(28,21,1, 349.99, 349.99),
-- Venta 29
(29,17,1,  24.99,  24.99),
(29,13,2,  17.99,  35.98),
-- Venta 30
(30,4, 1, 349.99, 349.99);