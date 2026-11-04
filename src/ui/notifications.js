/**
 * ModX Studio — notificaciones de interfaz.
 * Mantiene los avisos desacoplados de la lógica principal.
 */
export function showToast(message, type = "", container = document.querySelector("#toasts")) {
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = "toast " + type;
  notification.textContent = String(message);
  container.append(notification);

  setTimeout(() => notification.remove(), 4500);
}
