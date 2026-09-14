# Frontend — Banco  (Lab 1, Arquitectura de Software)

Frontend en **React + Vite + Axios** (JavaScript, sin TypeScript) para el Laboratorio 1. Consume el backend Spring Boot del repositorio `lab12026p-JEGD` (paquete `com.udea.lab12026p`) — el backend **no fue modificado** para que este frontend funcione en su modo por defecto.

## Vistas incluidas

1. **Clientes** — lista todos los clientes existentes (`GET /api/customers`) y permite crear uno nuevo con el botón "+ Nuevo cliente" (`POST /api/customers`).
2. **Transferencia** — transfiere dinero entre dos cuentas (`POST /api/transactions`), con validaciones de formulario y manejo de errores del backend (cuenta inexistente, saldo insuficiente, monto inválido, etc.).
3. **Histórico** — consulta las transacciones asociadas a una cuenta (`GET /api/transactions/{accountNumber}`).

## Requisitos previos

- Node.js 18 o superior y npm.
- El backend Spring Boot corriendo en `http://localhost:8080`, con MySQL conectado.

## Estructura del proyecto

```
lab12026p-frontend/
├── index.html
├── vite.config.js        # incluye el proxy de desarrollo hacia el backend
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx / App.css
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx
    │   └── StatusMessage.jsx
    ├── pages/
    │   ├── CustomersPage.jsx
    │   ├── TransferPage.jsx
    │   └── HistoryPage.jsx
    └── services/
        ├── api.js              # instancia central de Axios
        ├── customerService.js
        ├── transactionService.js
        └── errorUtils.js       # traduce errores del backend a mensajes legibles
```

## Cómo funciona la conexión con el backend

Este frontend llama a `/api/...` (ruta relativa) y **no** a `http://localhost:8080` directamente. El proxy configurado en `vite.config.js` redirige esas peticiones al backend durante `npm run dev`, así que **no necesitas CORS habilitado en el backend para que esto funcione en desarrollo**.

Si prefieres que el frontend llame directamente a `http://localhost:8080` (por ejemplo, para probarlo con otra herramienta o sin depender del proxy), el backend incluye una configuración CORS opcional en `config/CorsConfig.java` que permite peticiones desde `http://localhost:5173`. En ese caso, cambia `baseURL` en `src/services/api.js` de `'/api'` a `'http://localhost:8080/api'`.

## Instalación y ejecución

1. Clona o copia esta carpeta dentro de tu proyecto backend, respetando la ruta:
   ```
   lab12026p-JEGD/frontend/lab12026p-frontend/
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Asegúrate de que el backend esté corriendo en `http://localhost:8080` (MySQL conectado, sin errores en consola).
4. Levanta el frontend:
   ```bash
   npm run dev
   ```
5. Abre `http://localhost:5173` en el navegador.

## Comandos disponibles

| Comando           | Descripción                                    |
|-------------------|-------------------------------------------------|
| `npm run dev`     | Levanta el servidor de desarrollo (con proxy).  |
| `npm run build`   | Genera la build de producción en `dist/`.       |
| `npm run preview` | Sirve la build de producción localmente.        |
| `npm run lint`    | Corre el linter (oxlint).                       |


## Notas

- No se usa React Router; la navegación entre vistas es un simple estado (`useState`) en `App.jsx`, para mantener las dependencias al mínimo.
