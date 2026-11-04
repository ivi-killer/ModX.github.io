# Arquitectura de ModX Studio

> Documento de trabajo para la fase **Fundamentos**. Esta arquitectura se implementará de forma incremental; no implica reemplazar de inmediato la versión estable.

## Estado actual

La versión estable está publicada como sitio estático en GitHub Pages y no requiere compilación.

- `index.html`: estructura y vistas de la aplicación.
- `styles.css`: estilos globales y responsive.
- `app.js`: lógica de aplicación concentrada en un IIFE; durante F1 se conserva como implementación heredada.
- `src/main.js`: punto de entrada ES module que importa temporalmente `app.js` para mantener el comportamiento existente.
- `proxy/cloudflare-worker.js`: proxy opcional para proveedores de IA.
- Persistencia actual: `localStorage`, bajo la clave `modx_studio_v1`.
- Dependencias externas: JSZip y Three.js desde CDN.

La aplicación ya incluye proyectos, conversaciones, explorador/editor de archivos, importación/exportación, deshacer/rehacer, validación básica, taller de texturas y visualización experimental de geometrías.

## Objetivos de la nueva base

1. Mantener GitHub Pages como hosting estático y evitar un servidor propio obligatorio.
2. Mantener la compatibilidad con móviles y escritorio.
3. Separar la lógica por responsabilidades, evitando un único archivo gigante.
4. Migrar el almacenamiento a IndexedDB sin perder los datos existentes.
5. Mantener proyectos y archivos utilizables sin conexión cuando sus recursos estén disponibles localmente.
6. Permitir incorporar IA, texturas y modelado 3D como módulos independientes.
7. Conservar importación, exportación y copias de seguridad como vías de recuperación.

## Estructura objetivo

```text
/
├── index.html
├── styles.css
├── README.md
├── proxy/
│   └── cloudflare-worker.js
├── assets/
│   ├── icons/
│   └── images/
├── src/
│   ├── main.js
│   ├── core/
│   │   ├── app.js
│   │   ├── state.js
│   │   ├── events.js
│   │   └── router.js
│   ├── storage/
│   │   ├── database.js
│   │   ├── migrations.js
│   │   └── project-repository.js
│   ├── projects/
│   │   ├── project-manager.js
│   │   └── project-files.js
│   ├── editor/
│   │   ├── file-editor.js
│   │   └── validation.js
│   ├── ui/
│   │   ├── layout.js
│   │   ├── navigation.js
│   │   └── notifications.js
│   ├── ai/
│   ├── textures/
│   └── models/
└── docs/
    └── ARQUITECTURA.md
```

Los directorios `ai/`, `textures/` y `models/` se completarán en sus respectivas fases. No se crearán módulos vacíos ni se moverá código hasta que cada módulo tenga una responsabilidad definida.

## Reglas de arquitectura

- Usar JavaScript nativo con módulos ES (`type="module"`); no introducir un framework ni un proceso de compilación sin una necesidad concreta.
- `main.js` será el punto de entrada y coordinará la inicialización.
- `core/` gestionará el ciclo de vida, estado y navegación, pero no contendrá lógica específica de texturas o proveedores.
- `storage/` será la única capa que acceda directamente a IndexedDB.
- Los módulos de interfaz solicitarán operaciones a los servicios correspondientes; no manipularán la base de datos directamente.
- Los datos de cada proyecto estarán aislados por identificador.
- Las operaciones destructivas y las modificaciones de IA deberán poder revertirse o recuperarse mediante copias/versiones.
- No almacenar secretos de servidor en el repositorio ni incrustarlos en el frontend.

## Plan de implementación de Fundamentos

### F1. Base modular

**Estado: completada y probada por el usuario en GitHub Pages.**

- [x] Crear `src/main.js` como punto de entrada ES module.
- [x] Cambiar `index.html` para cargar `src/main.js` mediante `type="module"`.
- [x] Mantener temporalmente `app.js` como implementación activa y cargarlo desde el nuevo punto de entrada.
- [x] Extraer notificaciones (`src/ui/notifications.js`).
- [x] Extraer navegación (`src/ui/navigation.js`).
- [x] Centralizar lectura y escritura local (`src/storage/local-storage.js`).
- [x] Extraer creación y normalización del estado (`src/core/state.js`).
- [x] Extraer validación de proyectos (`src/editor/validation.js`).
- [x] Separar el registro de eventos de interfaz (`src/core/events.js`).
- [x] Extraer el ciclo de vida e inicialización (`src/core/app.js`).
- [x] Mantener `src/main.js` como entrada modular y `app.js` como coordinador temporal.
- [x] Probar la aplicación después de la extracción de eventos e inicialización desde GitHub Pages.

La migración es incremental: `app.js` sigue coordinando la aplicación y conserva las funciones heredadas que aún no se han extraído. Los módulos nuevos aíslan notificaciones, navegación, estado inicial, persistencia local, validación, registro de eventos y ciclo de vida. La extracción de proyectos, editor y servicios específicos continuará en etapas posteriores para evitar cambios de comportamiento innecesarios.

### F2. IA y trabajo sobre proyectos

**Estado: en desarrollo.**

Prioridades acordadas:
- Construir contexto a partir de los archivos del proyecto, con selección explícita de rutas.
- Permitir que la IA proponga la creación y modificación de varios archivos en una sola tarea.
- Validar rutas y estructura de las respuestas antes de permitir aplicar cambios.
- Presentar modificaciones como propuestas revisables y conservar historial para deshacerlas.
- Incorporar selección de modelos y proveedores compatibles, priorizando endpoints gratuitos disponibles.
- Mantener la conexión mediante el proxy configurado. La reparación del Worker queda pendiente y no se modifica sin solicitarlo.

Primeros módulos:
- `src/ai/context.js`: prepara contexto textual, permite limitarlo a rutas seleccionadas y omite contenido binario.
- `src/ai/response-parser.js`: interpreta respuestas JSON multiarchivo y rechaza rutas peligrosas o entradas inválidas. No aplica cambios por sí mismo.
- `src/ai/change-set.js`: clasifica los archivos nuevos y modificados y permite aplicar una propuesta completa o un subconjunto, sin escribir directamente en el proyecto desde el parser.

Integración inicial con el chat:
- [x] Importar los tres módulos desde `app.js`.
- [x] Construir el contexto del proyecto mediante `buildProjectContext()` antes de enviar la solicitud.
- [x] Interpretar las respuestas estructuradas mediante `parseAIResponse()`.
- [x] Crear un conjunto de cambios sin modificar inmediatamente los archivos.
- [x] Mostrar una propuesta multiarchivo con selección individual de archivos.
- [x] Permitir aplicar los archivos seleccionados o descartar la propuesta.
- [x] Registrar una instantánea antes de aplicar, para permitir revertir el conjunto con el botón Deshacer existente.

Siguientes tareas:
- Conectar el constructor de contexto y el parser al flujo actual de chat.
- Crear una capa de propuestas con comparación de archivos existentes y nuevos.
- Permitir aplicar o descartar el conjunto de cambios como una operación única.
- Añadir pruebas para rutas, respuestas incompletas y múltiples archivos.
- Implementar eliminación segura de proyectos, protegiendo el último proyecto y seleccionando otro automáticamente.

### F3. Sistema de proyectos y archivos
- Centralizar creación, selección, renombrado e importación de proyectos.
- Normalizar rutas y proteger contra rutas inválidas.
- Mantener separados los archivos de cada proyecto.
- Preparar operaciones seguras para crear, actualizar, renombrar y eliminar archivos.

### F4. Editor y validación
- Desacoplar el editor de la interfaz.
- Mantener historial de cambios y recuperación.
- Separar validación JSON/manifests de la presentación de resultados.

### F5. Estabilidad de interfaz
- Revisar diseño responsive, navegación móvil, estados vacíos, errores y accesibilidad básica.
- Probar tamaños de pantalla pequeños y escritorio.
- Verificar que las funciones actuales sigan operativas.

## Criterios para completar Fundamentos

- La aplicación se abre desde GitHub Pages sin servidor ni compilación.
- Los proyectos existentes se conservan tras la migración.
- Crear, cambiar, importar, editar y exportar proyectos funciona.
- El almacenamiento informa errores de cuota o persistencia sin perder silenciosamente los cambios.
- La interfaz funciona en móvil y escritorio.
- La fase termina con una versión estable etiquetada y un respaldo verificable.

## Política de cambios

Los cambios de esta etapa se realizan directamente en `main`, según la decisión del proyecto. Se aplicarán en commits pequeños y verificables. La rama `backup/v1.0.0` conserva intacto el punto de partida.
