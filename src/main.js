/**
 * ModX Studio — punto de entrada modular.
 *
 * Durante la primera etapa de migración, la aplicación existente permanece
 * en app.js para conservar su comportamiento. Los siguientes pasos extraerán
 * sus responsabilidades a módulos independientes sin cambiar la interfaz.
 *
 * Al importarlo como módulo ES, app.js conserva su inicialización mediante
 * DOMContentLoaded y se ejecuta una sola vez.
 */
import "../app.js";
