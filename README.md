# Yomilka Tours - Página Web

Página web de la agencia de viajes Yomilka Tours, construida con HTML, CSS y JavaScript puro. El contenido es completamente editable a través de Decap CMS.

## Colores oficiales
- **Azul:** `#1DA1F2`
- **Naranja:** `#F26522`

## Estructura del sitio

1. **Header fijo** - Logo + menú principal + menú secundario
2. **Slider principal** - 4 imágenes que cambian automáticamente
3. **Próximos Viajes** - 6 tarjetas de tours próximos
4. **Servicios** - Visados, Hoteles, Tours, Excursiones (iconos azules)
5. **Tours Realizados** - 6 tarjetas de tours pasados
6. **Instagram** - 6 publicaciones enlazadas
7. **Aliados** - Logos de empresas
8. **Footer azul** - Logo, slogan, contacto y redes sociales

## Cómo editar el contenido

### Opción 1: Desde el panel de administración (Decap CMS)
Una vez desplegado en Netlify:
1. Ve a `tusitio.netlify.app/admin`
2. Inicia sesión con tu cuenta de GitHub
3. Edita textos, imágenes y tours desde la interfaz visual

### Opción 2: Editando archivos JSON directamente
Los archivos de contenido están en la carpeta `/data/`:
- `settings.json` - Información de contacto y redes sociales
- `hero.json` - Imágenes del slider principal
- `upcoming.json` - Próximos viajes y excursiones
- `services.json` - Servicios ofrecidos
- `tours.json` - Tours realizados
- `instagram.json` - Publicaciones de Instagram
- `partners.json` - Empresas aliadas

## Cómo reemplazar imágenes

1. Sube tus imágenes a la carpeta `/images/`
2. Actualiza las rutas en los archivos JSON correspondientes
3. Las imágenes recomendadas para el slider deben ser de **1920x1080px** o mayor
3. Las tarjetas de tours funcionan mejor con imágenes **cuadradas (1:1)** o verticales **4:5**

## Formulario de cotización

Al hacer clic en "Cotizar" o en cualquier tour, se abre un modal con un formulario. 
Los datos se envían directamente por **WhatsApp** al número configurado en `settings.json`.

## Despliegue en Netlify

1. Conecta tu repositorio de GitHub en Netlify
2. La configuración está en `netlify.toml` (no requiere build)
3. Activa **Git Gateway** e **Identity** en Netlify para el CMS
4. Configura el dominio si lo deseas

## Soporte

Para cualquier duda o cambio en el diseño, contacta al desarrollador.
