# Proyecto 2 - Sistemas y Tecnologías Web

## José Manuel Sanchez Hernández

Aplicación web para gestionar el inventario y las ventas de una tienda con diferentes categorías. El frontend está hecho con React, el backend con Node.js/Express y la base de datos usa MySQL. Este se levanta localmente con Docker, pero igualmente está subido en producción.

---

## Tabla de contenidos

1. [Requisitos](#requisitos)
2. [Enlaces de producción](#enlaces-de-produccion)
3. [Credenciales de prueba](#credenciales-para-prueba)
4. [Levantar el proyecto](#levantar-el-proyecto)
5. [Variables de entorno](#variables-de-entorno)
6. [Despliegue en Render](#despliegue-en-render)
7. [Correr pruebas unitarias](#correr-pruebas-unitarias)
8. [Correr el linter](#correr-el-linter)
9. [Documentación de la API](#documentacion-de-la-api)
10. [Requisitos completados](#requisitos-completados)

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) para desarrollo local
- No se requiere Node.js, npm ni ninguna otra herramienta instalada localmente si se usa Docker.

---

## Enlaces de producción

Es importante saber que el tiempo de carga puede ser un poco más largo la primera vez que se accede a la página, debido a que el servidor se pone en reposo cuando no se está utilizando la aplicación. Simplemente hay que esperar a que inicie sesión, no hace falta tocar nada.

- Frontend: https://proyecto-2-web-frontend.onrender.com
- Backend: https://proyecto-2-web-backend.onrender.com

---

## Credenciales de prueba

Ingresa estos datos en la pantalla de login para poder ingresar al sistema:

- Usuario: `josesan`
- Contraseña: `secret`


---

## Levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto-2-DB
```

### 2. Crear el archivo de variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Editar `.env` y completar al menos `MYSQL_ROOT_PASSWORD` y `JWT_SECRET` con valores propios. Para el entorno local con Docker Compose, un ejemplo válido sería:


```env
MYSQL_ROOT_PASSWORD=cualquier_password_root
MYSQL_DATABASE=tienda_db
MYSQL_USER=proy2
MYSQL_PASSWORD=secret

BACKEND_PORT=3001
NODE_ENV=production
JWT_SECRET=cualquier_clave_secreta_larga
ALLOWED_ORIGINS=http://localhost:5174

FRONTEND_PORT=5174
VITE_API_URL=http://localhost:3001
```

Es importante mencionar que se comparten las variables de entorno por motivos académicos.

### 3. Levantar todos los servicios

```bash
docker compose --profile app up --build
```

En ejecuciones posteriores:

```bash
docker compose --profile app up
```

Importante: este proyecto usa perfiles en `docker-compose.yml`. Si se omite `--profile app`, los servicios principales (`db`, `backend`, `frontend`) no se levantan.

### 4. Acceder a la aplicación

| Servicio | URL |
|----------|-----|
| Frontend | `http://localhost:5174` |
| Backend | `http://localhost:3001` |
| API ping | `http://localhost:3001/api/ping` |

La base de datos se inicializa automáticamente con el esquema y los datos de prueba incluidos en `db/`.

### 5. Detener el proyecto

```bash
docker compose --profile app down 
```

Para detener y eliminar los volúmenes principales:

```bash
docker compose --profile app down
```

---

## Variables de entorno

Es importante mencionar que se comparte esta estructura por motivos académicos.

| Variable | Descripción | Valor recomendado |
|----------|-------------|-------------------|
| `MYSQL_ROOT_PASSWORD` | Contraseña del usuario root de MySQL | Libre |
| `MYSQL_DATABASE` | Nombre de la base de datos | `tienda_db` |
| `MYSQL_USER` | Usuario de la base de datos | `proy2` |
| `MYSQL_PASSWORD` | Contraseña del usuario de la base de datos | `secret` |
| `BACKEND_PORT` | Puerto publicado para el backend | `3001` |
| `NODE_ENV` | Entorno de Node.js | `production` |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT | Libre |
| `ALLOWED_ORIGINS` | Origen permitido por CORS para el frontend | `http://localhost:5174` |
| `FRONTEND_PORT` | Puerto publicado para el frontend | `5174` |
| `VITE_API_URL` | URL del backend que usa el frontend | `http://localhost:3001` |


## Correr pruebas unitarias

Las pruebas corren dentro de Docker sin necesidad de instalar nada localmente.

```bash
docker compose --profile test up --build
```

Esto levanta un contenedor dedicado que ejecuta `npm test` y termina.

### Qué se prueba

| Test | Descripción | Tests |
|------|-------------|-------|
| `ventaFormReducer.test.js` | Reducer de ventas: `SET_FIELD`, `ADD_ITEM`, `REMOVE_ITEM`, `SET_ITEM`, `RESET` | 5 |
| `ConfirmModal.test.jsx` | Renderizado del modal de confirmación y sus callbacks | 5 |
| `dashboardCards.test.js` | Función que construye las tarjetas del dashboard | 4 |

---

## Correr el linter

```bash
docker compose --profile lint up --build
```

Esto levanta un contenedor que ejecuta ESLint sobre el frontend y termina. Si no hay errores, el contenedor sale con codigo `0`.

Salida esperada:

```text
proyecto2_lint exited with code 0
```

---

## Documentación de la API

Base URL local: `http://localhost:3001`

Todos los endpoints devuelven JSON. Los endpoints protegidos requieren el header:

```text
Authorization: Bearer <token>
```

El token se obtiene al hacer login en `POST /api/auth/login`.

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/logout` | Cerrar sesión | No |

Body de `POST /api/auth/login`:

```json
{
  "username": "admin",
  "contrasena": "1234"
}
```

Respuesta exitosa:

```json
{
  "token": "<jwt>",
  "nombre_empleado": "Juan Perez",
  "cargo": "Administrador"
}
```

### Categorias `/api/categorias`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias` | Listar todas las categorías |
| GET | `/api/categorias/:id` | Obtener una categoría |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría |

Body de POST y PUT:

```json
{
  "nombre_categoria": "Electronica",
  "descripcion_categoria": "Dispositivos y accesorios electronicos"
}
```

### Productos `/api/productos`

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos/:id` | Obtener uno |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |

Body de POST y PUT:

```json
{
  "id_categoria": 1,
  "id_proveedor": 2,
  "nombre_producto": "Laptop Dell",
  "descripcion_producto": "Laptop Dell Inspiron 15",
  "precio_compra": 3500.0,
  "precio_venta": 4200.0,
  "stock_actual": 10
}
```

### Clientes `/api/clientes`

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/clientes` | Listar todos |
| GET | `/api/clientes/:id` | Obtener uno |
| POST | `/api/clientes` | Crear cliente |
| PUT | `/api/clientes/:id` | Actualizar cliente |
| DELETE | `/api/clientes/:id` | Eliminar cliente |

Body de POST y PUT:

```json
{
  "nombre_cliente": "Maria Garcia",
  "observaciones": "Cliente frecuente",
  "telefonos": ["55551234", "55559876"],
  "correos": ["maria@email.com"]
}
```

### Proveedores `/api/proveedores`

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/proveedores` | Listar todos |
| GET | `/api/proveedores/:id` | Obtener uno |
| POST | `/api/proveedores` | Crear proveedor |
| PUT | `/api/proveedores/:id` | Actualizar proveedor |
| DELETE | `/api/proveedores/:id` | Eliminar proveedor |

Body de POST y PUT:

```json
{
  "nombre_proveedor": "Tech Distribuidora",
  "direccion_proveedor": "Zona 10, Guatemala",
  "telefonos": ["24441234"],
  "correos": ["ventas@techdist.com"]
}
```

### Empleados `/api/empleados`

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/empleados` | Listar todos |
| GET | `/api/empleados/:id` | Obtener uno |
| POST | `/api/empleados` | Crear empleado |
| PUT | `/api/empleados/:id` | Actualizar empleado |
| PUT | `/api/empleados/:id/contrasena` | Cambiar contraseña |
| DELETE | `/api/empleados/:id` | Eliminar empleado |

Body de POST y PUT:

```json
{
  "nombre_empleado": "Carlos Lopez",
  "username": "clopez",
  "cargo": "Cajero",
  "fecha_contratacion": "2024-01-15",
  "estado": "activo",
  "contrasena": "1234",
  "telefonos": ["55551234"],
  "correos": ["carlos@tienda.com"]
}
```

### Ventas `/api/ventas`

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/ventas` | Listar todas las ventas |
| GET | `/api/ventas/:id` | Obtener una venta con su detalle |
| POST | `/api/ventas` | Registrar nueva venta |
| DELETE | `/api/ventas/:id` | Anular venta y restaurar stock |

Body de `POST /api/ventas`:

```json
{
  "id_empleado": 1,
  "id_cliente": 3,
  "items": [
    { "id_producto": 5, "cantidad": 2 },
    { "id_producto": 8, "cantidad": 1 }
  ]
}
```

`id_cliente` es opcional. Si se omite, la venta se registra como consumidor final.

### Reportes `/api/reportes`

Todos son `GET`, no requieren body y devuelven un array de objetos.

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/reportes/productos-detalle` | Productos con categoría y proveedor |
| `GET /api/reportes/ventas-completas` | Ventas con empleado y cliente |
| `GET /api/reportes/detalle-ventas` | Líneas de detalle de todas las ventas |
| `GET /api/reportes/ventas-por-categoria` | Ingresos y unidades vendidas por categoría |
| `GET /api/reportes/clientes-con-ventas` | Clientes que tienen al menos una compra |
| `GET /api/reportes/empleados-sobre-promedio-cargo` | Empleados con más ventas que el promedio de su cargo |
| `GET /api/reportes/ventas-por-empleado` | Resumen de ventas por empleado |
| `GET /api/reportes/productos-mas-vendidos` | Top 20 productos por unidades vendidas |
| `GET /api/reportes/ranking-clientes` | Ranking de clientes por monto total comprado |

### Ping

| Metodo | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ping` | Verifica que el backend y la BD estén activos |

Respuesta:

```json
{ "status": "ok", "db": "pong" }
```

---

## Requisitos completados

| Categoría | Requisito |
|-----------|-----------|
| **Arquitectura y API REST** | Endpoints REST documentados |
| | CRUD completo vía API (productos, ventas, clientes, entre otros.) |
| | Manejo de errores con códigos HTTP y mensajes JSON |
| | Endpoints de agregación |
| **Frontend - React** | React Router con mínimo 4 rutas |
| | Estado global con Context (sesión de usuario) |
| | Hooks: useState, useEffect, useCallback |
| | useReducer para estado complejo (formulario de ventas) |
| | Formularios controlados con validación cliente |
| | Reporte visible en UI (tablas y gráficas) |
| | Manejo visible de errores para el usuario |
| **Calidad de código** | ESLint configurado sin errores |
| | Pruebas unitarias con Vitest |
| **Despliegue** | README con instrucciones funcionales |
| | Proyecto levanta con docker compose up sin pasos adicionales | 
| **Avanzado** | Autenticación de usuarios (login/logout) con Context | 
| | Exportar reportes a CSV (pantalla de reportes) |