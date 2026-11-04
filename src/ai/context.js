/**
 * Construye el contexto del proyecto que se envía al proveedor de IA.
 * No modifica archivos ni estado; limita el contenido por archivo y permite
 * seleccionar rutas explícitas para tareas enfocadas.
 */

const DEFAULT_FILE_LIMIT = 12000;

export function buildProjectContext(project, selectedPaths = null, fileLimit = DEFAULT_FILE_LIMIT) {
  const files = project?.files || {};
  const availablePaths = Object.keys(files).sort();
  const selected = Array.isArray(selectedPaths)
    ? availablePaths.filter(path => selectedPaths.includes(path))
    : availablePaths;

  const sections = selected.map(path => {
    const content = files[path];

    if (typeof content !== "string") {
      return "--- " + path + " ---\n[contenido no textual]";
    }

    if (content.startsWith("__BASE64__:")) {
      return "--- " + path + " ---\n[recurso binario; contenido omitido]";
    }

    const truncated = content.length > fileLimit;
    const excerpt = truncated ? content.slice(0, fileLimit) : content;

    return "--- " + path + " ---\n" + excerpt +
      (truncated ? "\n[contenido truncado para limitar el contexto]" : "");
  });

  return {
    availablePaths,
    includedPaths: selected,
    text: [
      "PROYECTO: " + (project?.name || "Proyecto sin nombre"),
      "ARCHIVOS DISPONIBLES: " + availablePaths.length,
      "ARCHIVOS INCLUIDOS EN EL CONTEXTO: " + selected.length,
      sections.join("\n\n")
    ].join("\n")
  };
}
