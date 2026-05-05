# Proyecto 2 — Bases de Datos 1

Aplicación web para gestionar el inventario y las ventas de una tienda.
Incluye frontend en React, backend en Node.js/Express y base de datos MySQL,
todo orquestado con Docker.

---

## Requisitos

- Docker
- Docker Compose

No se necesita instalar Node.js, MySQL ni ninguna otra dependencia de forma local.

---

## Configuración

1. Clona el repositorio:

```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
```

2. Crea el archivo `.env` a partir del ejemplo:

```bash
   cp .env.example .env
```

   El archivo `.env.example` incluye todas las variables necesarias por motivos educativos. Igualmente es necesario que se llenes los campos de MY_SQL_ROOT_PASSWORD y JWT_SECRET con los valores que se deseen para poder levantar el proyecto.

---

## Levantar el proyecto

```bash
docker compose up --build
```

La primera vez Docker construye las imágenes, inicializa la base de datos
y carga los datos de prueba automáticamente. Esto puede tomar un tiempo.

Una vez levantado:

| Servicio  | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:5174  |
| Backend   | http://localhost:3001  |
| Base de datos | puerto 3306        |

Para detener:

```bash
docker compose down
```

Para detener y eliminar los datos (reinicio limpio):

```bash
docker compose down -v
docker compose up --build
```

---

## Credenciales de prueba

Al levantar el proyecto por primera vez se cargan datos de prueba que incluyen
un empleado con usuario y contraseña listo para iniciar sesión.

Este es el usuario para desarrollo:

- Username: josesan
- Contraseña: secret


---

## Variables de entorno

Todas las variables se definen en el archivo `.env`. El repositorio incluye
`.env.example` con las variables requeridas y sus valores por defecto.

| Variable            | Descripción                              |
|---------------------|------------------------------------------|
| MYSQL_ROOT_PASSWORD | Contraseña del usuario root de MySQL     |
| MYSQL_DATABASE      | Nombre de la base de datos               |
| MYSQL_USER          | Usuario de la base de datos (proy2)      |
| MYSQL_PASSWORD      | Contrasena del usuario (secret)          |
| BACKEND_PORT        | Puerto del backend (3001)                |
| FRONTEND_PORT       | Puerto del frontend (5174)               |
| VITE_API_URL        | URL del backend para el frontend         |
| JWT_SECRET          | Clave secreta para firmar tokens JWT     |
| NODE_ENV            | Entorno de ejecución (production)        |

---

## Base de datos

**DBMS:** MySQL

**Tablas principales:**

- `categoria` — categoría de productos
- `proveedor` — proveedores con teléfonos y correos multivaluados
- `producto` — inventario con precio de compra, venta y stock
- `empleado` — personal con autenticación
- `cliente` — clientes registrados con telefonos y correos multivaluados
- `venta` — información de cada venta con empleado y cliente opcional
- `detalle_venta` — líneas de productos por venta

**Tablas auxiliares:**
`telefono_proveedor`, `correo_proveedor`, `telefono_empleado`,
`correo_empleado`, `telefono_cliente`, `correo_cliente`

---

**Índices**

```sql
CREATE INDEX idx_producto_categoria ON producto (id_categoria);
CREATE INDEX idx_venta_fecha ON venta (fecha_hora_venta);
CREATE INDEX idx_venta_empleado ON venta (id_empleado);
```

`idx_producto_categoria`: la columna `id_categoria` en `producto` se usa
bastante para filtrar y agrupar productos por categoría, tanto en la
lista de productos como en los reportes de ventas por categoría. Sin este
índice, cada consulta requeriría un escaneo completo de la tabla.

`idx_venta_fecha`: la columna `fecha_hora_venta` en `venta` se consulta
en los reportes ordenados cronológicamente. Al ser un campo DATETIME sobre
el que se ordena con `ORDER BY`, el índice evita una ordenaciónn completa
de la tabla en cada consulta.

`idx_venta_empleado`: la columna `id_empleado` en `venta` se usa en
JOINs y en el reporte de ventas por empleado, que agrupa y suma totales
por empleado. El índice acelera tanto el JOIN como el GROUP BY sobre
esta columna.


**Vista:**

```sql
CREATE VIEW vista_ventas_por_categoria ...
```

Ingresos y unidades vendidas por categoría, utilizada
por el backend en el reporte de ventas por categoría.

---

## Funcionalidades

**CRUD completo:**
Categorías, Productos, Proveedores, Clientes, Empleados y Ventas.

**Autenticación:**
Login y logout con sesión basada en JWT. Las rutas del backend están
protegidas con middleware. El frontend redirige al login si el token
es inválido o ha expirado.

**Reportes disponibles en la UI:**

| Reporte | Tipo de consulta |
|---------|-----------------|
| Productos con categoría y proveedor | JOIN múltiple |
| Ventas con empleado y cliente | JOIN múltiple |
| Información de detalles de ventas | JOIN multiple |
| Ventas por categoría | VIEW |
| Clientes con compras registradas | Subconsulta IN |
| Empleados sobre promedio de su cargo | Subconsulta correlacionada |
| Resumen de ventas por empleado | GROUP BY + HAVING + agregacion |
| Productos más vendidos | GROUP BY + HAVING + agregación |
| Ranking de clientes | CTE (WITH) |

Todos los reportes pueden exportarse a CSV desde la interfaz.

**Transacciones explícitas:**
Las operaciones críticas como crear venta, anular venta, crear/editar cliente,
proveedor y empleado usan `BEGIN / COMMIT / ROLLBACK` explícitos con
manejo de error.

---