# ModX Studio

<p align="center">
  <a href="https://ivi-killer.github.io/ModX.github.io/"><strong>🚀 Abrir ModX Studio</strong></a>
</p>

**Acceso directo:** https://ivi-killer.github.io/ModX.github.io/

**ModX** es un estudio web asistido por inteligencia artificial para crear, editar, organizar y exportar add-ons de **Minecraft Bedrock Edition**. Reúne en una sola interfaz un chat especializado, un espacio de trabajo con proyectos, herramientas para editar archivos y utilidades para trabajar con recursos del juego.

ModX está pensado como una herramienta personal y extensible: puedes conectar un proveedor de IA compatible, trabajar en distintos proyectos y conservar tus archivos y conversaciones en el almacenamiento local de tu navegador.

## Empezar rápidamente

1. Abre **[ModX Studio](https://ivi-killer.github.io/ModX.github.io/)**.
2. En el panel lateral, entra en **Configuración**.
3. Selecciona NVIDIA Build (o añade otro proveedor compatible), introduce tu API key y configura la URL del Cloudflare Worker si el proveedor necesita proxy.
4. Pulsa **Probar conexión** y luego **Guardar proveedor**.
5. Crea un proyecto y empieza a conversar con la IA.

Los proyectos, archivos y chats se guardan localmente en el navegador. Usa el mismo navegador y dispositivo para acceder a esos datos.

## ¿Qué puedes hacer con ModX?

- **Crear add-ons con IA:** describe lo que quieres construir y conversa con un modelo especializado en Minecraft Bedrock.
- **Organizar proyectos:** crea varios espacios de trabajo y cambia entre ellos desde el panel lateral. Cada proyecto mantiene sus propios archivos y conversaciones.
- **Administrar chats:** guarda conversaciones dentro del proyecto y elimina individualmente las que ya no necesites.
- **Editar archivos:** explora la estructura del Behavior Pack y Resource Pack, abre archivos y modifica su contenido desde el editor integrado.
- **Importar contenido:** carga archivos individuales o paquetes `.mcaddon`, `.mcpack` y `.zip`, además de JSON e imágenes.
- **Proteger cambios:** utiliza las opciones de deshacer y rehacer para recuperar modificaciones recientes.
- **Validar el proyecto:** revisa errores básicos de sintaxis JSON, manifests y UUID duplicados.
- **Crear texturas:** usa el taller pixel-art para dibujar texturas y, si configuras un servicio compatible, solicitar imágenes a un modelo.
- **Previsualizar geometrías:** visualiza de forma experimental modelos definidos mediante archivos de geometría JSON de Bedrock.
- **Exportar add-ons:** empaqueta los archivos del proyecto en un archivo `.mcaddon` para importarlo en Minecraft Bedrock.

## Proveedores de inteligencia artificial

ModX permite configurar proveedores con una API compatible con el formato de OpenAI Chat Completions.

- **NVIDIA Build:** URL base `https://integrate.api.nvidia.com/v1`. La configuración actual de ModX utiliza el modelo `nvidia/nemotron-3-ultra-550b-a55b`, streaming SSE, `temperature: 1`, `top_p: 0.95`, `max_tokens: 16384` y `chat_template_kwargs.enable_thinking=true`.
- **OpenAI:** URL base `https://api.openai.com/v1`.
- **Otros proveedores:** puedes introducir una URL base, un identificador de modelo y una API key si el servicio ofrece una API compatible.

En Configuración puedes guardar un proveedor, cargar su catálogo mediante `GET /models` cuando esté disponible y probar la conexión con una inferencia real a `POST /chat/completions`.

Los modelos sugeridos son referencias, no una garantía de acceso gratuito. La disponibilidad de modelos, free endpoints, cuotas, límites y permisos depende del proveedor y de tu cuenta. En NVIDIA Build, comprueba la disponibilidad y las condiciones del modelo en su catálogo.

## Conexión mediante Cloudflare Worker

ModX es una aplicación web estática que realiza las solicitudes desde el navegador. Algunos proveedores restringen las solicitudes directas por CORS. Para esos casos, puedes desplegar el proxy incluido en `proxy/cloudflare-worker.js` como un **Cloudflare Worker**.

1. Despliega `proxy/cloudflare-worker.js` en Cloudflare Workers.
2. Configura `ALLOWED_HOSTS` con los dominios de los proveedores que quieras permitir. Por ejemplo: `integrate.api.nvidia.com,api.openai.com`.
3. Copia la URL pública de tu Worker.
4. En ModX, abre **Configuración** y pega esa dirección en el campo **Proxy HTTPS** del proveedor correspondiente.
5. Guarda la configuración y utiliza **Probar conexión**.

El proxy reenvía las solicitudes al proveedor permitido y facilita la comunicación desde el navegador. No sustituye la API del proveedor ni proporciona acceso gratuito a los modelos.

**Importante sobre la seguridad:** el proxy incluido es una solución práctica para uso personal, no una arquitectura multiusuario segura. La API key se utiliza desde el navegador y puede ser accesible para quien tenga acceso a esa sesión o dispositivo. No publiques claves API en repositorios, no las incluyas en código público y no compartas la URL de un proxy personal sin protegerlo adecuadamente. No uses este diseño para ofrecer cuentas o acceso público a terceros.

## Datos, almacenamiento y privacidad

- Los proyectos, archivos, conversaciones, preferencias y claves API se guardan en el `localStorage` del navegador.
- Los datos locales no se sincronizan automáticamente entre dispositivos o navegadores.
- Si borras los datos del sitio o cambias de navegador/dispositivo, puedes perder la información guardada. Exporta tus add-ons y conserva copias de seguridad de los archivos importantes.
- Las solicitudes enviadas a un proveedor de IA se procesan según las condiciones y políticas de ese proveedor.
- Evita guardar claves API en dispositivos compartidos.

## Limitaciones conocidas

- La lista de modelos depende de que el proveedor permita consultar `/models`; si no está disponible, introduce el identificador manualmente.
- La generación de imágenes requiere un servicio compatible con `/images/generations` que devuelva una imagen en `data[0].b64_json`. No todos los proveedores o modelos ofrecen ese formato.
- La vista 3D es experimental y no reemplaza herramientas especializadas como Blockbench ni las pruebas en Minecraft.
- El validador realiza comprobaciones estáticas básicas; no garantiza que un add-on funcione correctamente dentro del juego.
- El streaming depende de que el proveedor y el proxy mantengan correctamente la conexión.

## Publicación

ModX puede publicarse como un sitio estático mediante GitHub Pages:

1. Abre **Settings → Pages** en el repositorio.
2. Selecciona **Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/(root)`.
4. Guarda los cambios y espera a que GitHub Pages publique el sitio.

No requiere un proceso de compilación. Las dependencias principales se cargan desde CDN: **JSZip** y **Three.js**.

## Proyecto y atribución

ModX es un proyecto independiente y no está afiliado, respaldado ni patrocinado por Mojang Studios o Microsoft. Minecraft y Minecraft Bedrock Edition son marcas de sus respectivos propietarios.

---

## Un pequeño extra 🐈

La documentación necesitaba una revisión felina. (La imagen se añadirá aquí cuando el archivo esté incorporado al repositorio.)
