# Proyecto 3 — Base de Datos 1
### José Manuel Sanchez Hernández
---

Extensión del Proyecto 2 con seguridad a nivel de base de datos:
roles y permisos en el DBMS, stored procedures y ORM (Sequelize). 
Se siguió trabajando con el tema del sistema para una tienda que maneja ingreso de productos por categoría, gestión de empleados, proveedores, vista de reportes y registro de ventas.

## Requisitos

- Docker y Docker Compose

## Levantar el proyecto

### Clonar y entrar al repositorio
```bash
git clone https://github.com/josesan28/Proyecto-2-DB.git
cd Proyecto-2-DB
git checkout proyecto-3
```

### Copiar variables de entorno
```bash
cp .env.example .env
# Editar .env y completar los valores vacíos:
#   MYSQL_ROOT_PASSWORD=contraseña_mysql
#   JWT_SECRET=cualquier_string_largo
```

### Levantar el proyecto con Docker

```bash
docker compose up --build
```

La aplicación queda disponible en:
- Frontend: http://localhost:5174
- Backend:  http://localhost:3001

> La primera vez Docker inicializa la base de datos ejecutando los
> scripts en orden. Si ya existe el volumen, los scripts no corren.
> Para reiniciar desde cero: `docker compose down -v`
> Luego se vuelve a levantar con `docker compose up --build`

## Lint y tests

Para verificar el frontend localmente:

```bash
cd frontend
npm run lint
npm test
```

Si prefieres usar Docker:

```bash
docker compose --profile lint run --rm lint
docker compose --profile test run --rm test
```

## Credenciales de calificación definidas directamente en el .env.example para mayor facilidad

| Campo    | Valor   |
|----------|---------|
| Usuario  | proy3   |
| Contraseña | secret |

## Usuarios de prueba por rol

Todos usan la contraseña **`password`**

| Username   | Cargo     | Permisos principales                                      |
|------------|-----------|-----------------------------------------------------------|
| admin      | admin     | Acceso total, incluyendo gestión de empleados             |
| gerente    | gerente   | Todo excepto crear/editar y borrar empleados.             |
| vendedor   | vendedor  | Registrar ventas, gestionar clientes y ver productos      |
| bodeguero  | bodeguero | Gestionar productos, categorías y proveedores             |
| auditor    | auditor   | Solo lectura en todas las secciones                       |

## Esquema de roles en el DBMS

Los roles se definen en `db/03_roles.sql` con `CREATE ROLE` y tienen permisos
granulares por tabla.

| Rol           | Tablas con escritura                                      | Solo lectura                        |
|---------------|-----------------------------------------------------------|-------------------------------------|
| rol_admin     | Todas                                                     | —                                   |
| rol_gerente   | categoria, proveedor, producto, cliente, venta, detalle   | empleado                            |
| rol_vendedor  | cliente, venta, detalle_venta                             | producto, categoria, proveedor      |
| rol_bodeguero | categoria, proveedor, producto                            | —                                   |
| rol_auditor   | —                                                         | Todas                               |

## Stored Procedures

Definidos en `db/04_procedures.sql`:

| Procedure                   | Descripción                                                        |
|-----------------------------|--------------------------------------------------------------------|
| `sp_registrar_venta`        | Registra venta completa. IN/OUT, valida stock, ROLLBACK en error   |
| `sp_anular_venta`           | Anula venta y restaura stock. ROLLBACK en error                    |
| `sp_ajustar_stock`          | Ajusta stock de un producto. Parámetro OUT con stock resultante    |
| `sp_upsert_cliente`         | Crea o actualiza un cliente                                        |
| `sp_reporte_ventas_periodo` | Reporte de ventas filtrado por rango de fechas                     |

## ORM

Se usa **Sequelize** para las operaciones CRUD de:
- Categorías (findAll, findById, insert, update, remove)
- Productos (findAll, findById, insert, update, remove)
- Clientes (findAll, findById, insert, update, remove)
- Proveedores (findAll, findById, insert, update, remove)
- Empleados (findAll, findById, insert, update, remove)

Las consultas avanzadas, reportes y stored procedures, usan SQL directo.