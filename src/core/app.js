/**
 * ModX Studio — ciclo de vida de la aplicación.
 */
export function startApplication(initialize) {
  if (typeof initialize !== "function") {
    throw new TypeError("La inicialización de ModX debe ser una función.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}
