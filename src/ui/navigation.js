/**
 * ModX Studio — navegación entre vistas.
 */
export function activateView(view, { renderTree, renderGeometryOptions } = {}) {
  document.querySelectorAll(".view").forEach(element => {
    element.classList.toggle("active", element.id === view + "View");
  });

  document.querySelectorAll(".nav[data-view]").forEach(element => {
    element.classList.toggle("active", element.dataset.view === view);
  });

  const titles = {
    chat: "Estudio",
    files: "Archivos",
    textures: "Texturas",
    models: "Vista 3D"
  };

  const title = document.querySelector("#viewTitle");
  if (title) title.textContent = titles[view] || view;

  document.querySelector("#sidebar")?.classList.remove("open");

  if (view === "files") renderTree?.();
  if (view === "models") renderGeometryOptions?.();
}
