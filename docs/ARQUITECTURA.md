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

**Estado: en curso.**

- [x] Crear `src/main.js` como punto de entrada ES module.
- [x] Cambiar `index.html` para cargar `src/main.js` mediante `type="module"`.
- [x] Mantener temporalmente `app.js` intacto y cargarlo desde el nuevo punto de entrada.
- [x] Extraer la utilidad de notificaciones en `src/ui/notifications.js` y conectarla con `app.js` mediante un adaptador.
- [ ] Comprobar rutas relativas y funcionamiento desde GitHub Pages en móvil y escritorio.

El puente inicial es intencional: no representa todavía la modularización completa. `app.js` seguirá siendo la implementación activa hasta que sus responsabilidades puedan extraerse y probarse de forma independiente.

### F2. Persistencia fiable
- Crear una capa IndexedDB con versión de esquema.
- Detectar los datos existentes en `localStorage` (`modx_studio_v1`).
- Migrar proyectos, conversaciones, preferencias y recursos sin sobrescribir datos.
- Verificar la migración antes de considerar la copia antigua prescindible.
- Añadir exportación/importación de respaldo de datos.

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
