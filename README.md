# ModX Studio

Aplicación web estática para crear y editar add-ons de Minecraft Bedrock con proveedores de IA configurables.

## Publicar con GitHub Pages
1. Abre Settings → Pages en este repositorio.
2. En Build and deployment, selecciona Deploy from a branch.
3. Selecciona la rama main y la carpeta root (/).
4. Guarda. La publicación estará disponible en https://ivi-killer.github.io/ModX.github.io/ tras unos minutos.

## Uso
- Abre Configuración y añade un proveedor, URL base, modelo y API Key.
- NVIDIA y OpenAI vienen como opciones iniciales; puedes añadir cualquier endpoint compatible con OpenAI Chat Completions.
- Describe el add-on. ModX envía contexto especializado de Bedrock y espera un JSON con archivos completos para integrarlos.
- Importa archivos o paquetes mcaddon, mcpack y zip.
- Edita archivos desde el explorador, dibuja PNG pixel art y exporta el proyecto como mcaddon.

## Limitaciones
- Es una aplicación frontend estática. Las llamadas se hacen desde el navegador al proveedor; este debe permitir CORS.
- API keys, proyectos e historial se guardan en localStorage de este navegador. No uses equipos compartidos.
- El modelo de texto genera JSON, geometría y código; el taller permite dibujar texturas PNG. La generación de imágenes por IA requiere una integración de endpoint de imágenes compatible.
- La exportación empaqueta los archivos del proyecto. Revisa compatibilidad, UUID, manifests y referencias antes de instalarlo.
- ModX no está afiliado a Mojang ni Microsoft.

Tecnologías: HTML, CSS, JavaScript, JSZip y localStorage. Sin proceso de compilación.