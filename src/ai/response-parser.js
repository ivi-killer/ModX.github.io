/**
 * Normaliza respuestas estructuradas de ModX AI.
 * Acepta JSON directo o JSON dentro de un bloque Markdown.
 * Los cambios se devuelven como propuesta; este módulo nunca escribe archivos.
 */

export function parseAIResponse(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;

  let source = raw.trim()
    .replace(/^\uFEFF/, "")
    .replace(/^\x60{3}(?:json)?\s*/i, "")
    .replace(/\s*\x60{3}\s*$/, "")
    .trim();

  let data;
  try {
    data = JSON.parse(source);
  } catch {
    const start = source.indexOf('{"summary"');
    if (start < 0) return null;
    try {
      data = JSON.parse(source.slice(start));
    } catch {
      return null;
    }
  }

  if (!data || !Array.isArray(data.files)) return null;

  const files = [];
  const rejected = [];
  const seen = new Set();

  for (const item of data.files) {
    if (!item || typeof item.path !== "string" ||
        typeof item.content !== "string") {
      rejected.push("Entrada de archivo incompleta o inválida.");
      continue;
    }

    const path = item.path.trim().replace(/\\/g, "/");
    const parts = path.split("/");

    if (!path || path.startsWith("/") ||
        /^[a-z]:/i.test(path) ||
        parts.some(part => !part || part === "." || part === "..") ||
        path.includes("\0")) {
      rejected.push("Ruta rechazada: " + item.path);
      continue;
    }

    if (seen.has(path)) {
      rejected.push("Ruta duplicada: " + path);
      continue;
    }

    seen.add(path);
    files.push({ path, content: item.content });
  }

  return {
    summary: typeof data.summary === "string" ? data.summary : "Propuesta de cambios",
    notes: Array.isArray(data.notes)
      ? data.notes.filter(note => typeof note === "string")
      : [],
    files,
    rejected
  };
}
