# Guía rápida para desplegar la web de boda

## 1. Qué contiene el ZIP

- `frontend/`: web Angular pública y panel privado.
- `backend/`: API Node.js/Express con MongoDB, login privado, RSVP y exportación Excel.
- `backend/.env.example`: ejemplo de variables de entorno.

## 2. Opción recomendada de despliegue

La forma más sencilla es:

- Base de datos: MongoDB Atlas.
- Backend: Render.
- Frontend: Vercel o Netlify.

## 3. Crear la base de datos en MongoDB Atlas

1. Entra en MongoDB Atlas.
2. Crea una cuenta y un cluster gratuito.
3. Crea un usuario de base de datos con contraseña.
4. En Network Access, permite acceso desde `0.0.0.0/0` para empezar fácil.
5. Copia la cadena de conexión, parecida a:

```txt
mongodb+srv://usuario:password@cluster.mongodb.net/boda_web
```

## 4. Desplegar el backend en Render

1. Sube este proyecto a GitHub.
2. En Render, crea un nuevo servicio tipo **Web Service**.
3. Conecta el repositorio.
4. En Root Directory pon:

```txt
backend
```

5. Build Command:

```txt
npm install
```

6. Start Command:

```txt
npm start
```

7. Añade estas variables de entorno en Render:

```txt
PORT=10000
MONGODB_URI=tu_url_de_mongodb_atlas
JWT_SECRET=una_clave_larga_y_segura
ADMIN_EMAIL=tu_email_de_admin
ADMIN_PASSWORD=tu_password_de_admin
FRONTEND_URL=https://tu-web.vercel.app
```

8. Cuando Render termine, copia la URL del backend. Será algo como:

```txt
https://boda-web-backend.onrender.com
```

## 5. Conectar el frontend con el backend

En el archivo:

```txt
frontend/src/environments/environment.ts
```

cambia:

```ts
apiUrl: 'http://localhost:3000/api'
```

por:

```ts
apiUrl: 'https://TU-BACKEND-RENDER.onrender.com/api'
```

## 6. Desplegar el frontend en Vercel

1. Entra en Vercel.
2. Importa el repositorio desde GitHub.
3. En Root Directory pon:

```txt
frontend
```

4. Build Command:

```txt
npm run build
```

5. Output Directory:

```txt
dist/boda-web-frontend/browser
```

Si Vercel no encuentra esa carpeta, revisa el resultado del build porque Angular puede crear una ruta ligeramente distinta según versión.

## 7. Entrar al panel privado

Cuando esté online, entra en:

```txt
https://tu-web.vercel.app/admin
```

Usa el email y contraseña que pusiste en Render:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
```

Desde ahí podrás ver respuestas y exportarlas a Excel.

## 8. Probar antes de mandarla a invitados

Comprueba:

- Que el formulario envía correctamente.
- Que aparece la respuesta en `/admin/panel`.
- Que el botón exportar Excel descarga el archivo.
- Que los botones de Google Maps abren correctamente.
- Que la web se ve bien desde móvil.
