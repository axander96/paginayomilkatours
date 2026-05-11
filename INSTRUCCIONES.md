# 🚀 Guía para Publicar Yomilka Tours en Internet

## PASO 1: Conectar con Netlify (Alojamiento Gratis)

1. Ve a **https://www.netlify.com**
2. Haz clic en **"Sign up"** (Registrarse)
3. Elige **"Sign up with GitHub"** (Registrarse con GitHub)
4. Acepta los permisos para que Netlify acceda a tus repositorios

---

## PASO 2: Desplegar tu sitio

1. En el dashboard de Netlify, haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **GitHub**
3. Busca y selecciona el repositorio: **`paginayomilkatours`**
4. En la configuración de deploy deja todo así:
   - **Branch to deploy:** `master`
   - **Build command:** (déjalo vacío)
   - **Publish directory:** `.` (punto)
5. Haz clic en **"Deploy site"**

⏳ Espera 1-2 minutos y Netlify te dará una URL como:
`https://paginayomilkatours-abc123.netlify.app`

---

## PASO 3: Activar el Panel de Edición (CMS)

Para poder editar textos e imágenes sin tocar código:

### Activar Identity (Usuarios)
1. En tu sitio de Netlify, ve a la pestaña **"Identity"**
2. Haz clic en **"Enable Identity"**
3. Ve a **"Settings and usage"** dentro de Identity
4. En **"Registration preferences"** selecciona **"Invite only"** (más seguro)
5. En **"External providers"** activa **GitHub**

### Activar Git Gateway (Para que el CMS guarde cambios)
1. Ve a la pestaña **"Site configuration"** → **"Identity"** → **"Services"**
2. Busca **"Git Gateway"** y haz clic en **"Enable Git Gateway"**
3. Confirma con tu contraseña de GitHub si te lo pide

### Invitarte a ti mismo
1. Ve a **"Identity"** → **"Invite users"**
2. Escribe tu correo electrónico y envía la invitación
3. Revisa tu correo y acepta la invitación

---

## PASO 4: Acceder al panel de edición

1. Ve a: `https://TU-URL.netlify.app/admin`
   (Reemplaza TU-URL con la que te dio Netlify)
2. Haz clic en **"Login with GitHub"**
3. ¡Listo! Verás un panel con todas las secciones para editar:
   - Configuración General (teléfono, dirección, redes sociales)
   - Slider Principal (imágenes del inicio)
   - Próximos Viajes
   - Servicios
   - Tours Realizados
   - Instagram
   - Aliados

---

## PASO 5: Cambiar el dominio (Opcional)

Si quieres un dominio más bonito como `yomilkatours.netlify.app`:

1. En Netlify ve a **"Site configuration"** → **"Domain management"**
2. En **"Custom domains"** haz clic en **"Options"** → **"Edit site name"**
3. Escribe el nombre que quieras, por ejemplo: `yomilkatours`
4. Tu nueva URL será: `https://yomilkatours.netlify.app`

**⚠️ IMPORTANTE:** Después de cambiar el dominio, actualiza el archivo `admin/config.yml` en la línea `site_url` con tu nueva URL.

---

## 📁 Cómo agregar imágenes

### Método 1: Desde el panel de administración (Más fácil)
1. Entra a `/admin`
2. Edita cualquier sección
3. Donde dice "Imagen" haz clic en **"Choose different image"**
4. Sube tu foto directamente

### Método 2: Subiendo archivos a GitHub
1. Ve a tu repositorio en GitHub: `github.com/axander96/paginayomilkatours`
2. Entra a la carpeta `images/`
3. Haz clic en **"Add file"** → **"Upload files"**
4. Sube tus fotos
5. Luego edita los archivos JSON en la carpeta `data/` para poner la ruta correcta

### Nombres de archivos recomendados:

| Sección | Archivos necesarios | Tamaño recomendado |
|---|---|---|
| Slider | `slide1.jpg` a `slide4.jpg` | 1920x1080px (horizontal) |
| Próximos viajes | `tour1.jpg` a `tour6.jpg` | 1080x1350px (vertical 4:5) |
| Tours realizados | `done1.jpg` a `done6.jpg` | 1080x1350px (vertical 4:5) |
| Instagram | `insta1.jpg` a `insta6.jpg` | 1080x1080px (cuadrado) |
| Aliados | `partner1.png` a `partner6.png` | 400x200px (horizontal) |

---

## 📱 El formulario de cotización

Cuando alguien llene el formulario, los datos se enviarán por **WhatsApp** al número que configures en:
- Panel de admin → Configuración General → WhatsApp

El formato del número debe ser como: `+18095551234` (con código de país)

---

## ❓ ¿Necesitas ayuda?

Si algo no funciona, revisa:
1. ¿Identity está activado en Netlify?
2. ¿Git Gateway está activado?
3. ¿Aceptaste la invitación por correo?
4. ¿La URL del sitio en `admin/config.yml` es correcta?

---

**¡Tu página está lista para volar! ✈️🌴**
