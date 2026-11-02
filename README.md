# ModX Studio

Aplicación web estática para crear y editar add-ons de Minecraft Bedrock con proveedores de IA configurables.

## Publicación
GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root).

## Proveedores de IA
- NVIDIA Build: base URL `https://integrate.api.nvidia.com/v1`.
- OpenAI: base URL `https://api.openai.com/v1`.
- Otros proveedores: cualquier API compatible con OpenAI Chat Completions.
- Carga el catálogo con **Cargar modelos** (`GET /models`) o escribe el identificador manualmente.
- **Probar conexión** envía una inferencia corta real (`POST /chat/completions`).
- Los modelos sugeridos son ejemplos; disponibilidad, free endpoints, límites y permisos dependen del catálogo y de tu cuenta. Comprueba la etiqueta Free Endpoint en NVIDIA Build.

## Funciones
- Chat con contexto especializado de Minecraft Bedrock y conversaciones guardadas.
- Importación de `.mcaddon`, `.mcpack`, `.zip`, JSON, imágenes y archivos.
- Explorador y editor de archivos.
- Deshacer/rehacer cambios recientes.
- Validador básico de JSON, manifests y UUID.
- Taller pixel-art.
- Vista previa 3D experimental de geometrías Bedrock JSON.
- Exportación de proyecto como `.mcaddon`.

## Diagnóstico de conexión (fetch)
ModX diferencia errores HTTP (401/403/404/429/5xx) de fallos de red/CORS. La aplicación estática se ejecuta en el navegador; **no puede evitar las reglas CORS del proveedor**. NVIDIA publica su API OpenAI-compatible en `https://integrate.api.nvidia.com/v1`, pero si el navegador bloquea la petición se necesita un proxy HTTPS controlado por el usuario (por ejemplo, Cloudflare Worker) o un proveedor que permita CORS. No publiques claves API en repositorios ni las compartas.

## Privacidad y límites
- API keys, proyectos e historial se guardan en localStorage del navegador. Evita dispositivos compartidos.
- La prueba de conexión confirma que el endpoint responde con el modelo seleccionado, no garantiza que tenga cuota o que esté disponible siempre.
- El listado `/models` puede no estar habilitado por todos los proveedores. En ese caso, escribe el model ID manualmente.
- La vista 3D es una previsualización básica, no un sustituto de Blockbench ni del motor de Minecraft.
- La validación es estática y no sustituye las pruebas dentro de Minecraft.
- ModX no está afiliado a Mojang ni Microsoft.

Dependencias CDN: JSZip y Three.js. Sin proceso de compilación.
