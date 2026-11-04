/**
 * Prepara y aplica conjuntos de cambios multiarchivo.
 * La propuesta es inmutable y no altera el proyecto hasta llamar applyChangeSet.
 */

export function createChangeSet(projectFiles, parsedResponse) {
  const current = projectFiles || {};
  const proposed = parsedResponse?.files || [];

  const changes = proposed.map(file => ({
    path: file.path,
    content: file.content,
    action: Object.prototype.hasOwnProperty.call(current, file.path) ? "update" : "create",
    previousContent: Object.prototype.hasOwnProperty.call(current, file.path)
      ? current[file.path]
      : null
  }));

  return {
    summary: parsedResponse?.summary || "Cambios propuestos",
    notes: parsedResponse?.notes || [],
    rejected: parsedResponse?.rejected || [],
    changes,
    createdCount: changes.filter(change => change.action === "create").length,
    updatedCount: changes.filter(change => change.action === "update").length
  };
}

export function applyChangeSet(projectFiles, changeSet, selectedPaths = null) {
  const next = { ...(projectFiles || {}) };
  const allowed = selectedPaths ? new Set(selectedPaths) : null;
  const applied = [];

  for (const change of changeSet?.changes || []) {
    if (allowed && !allowed.has(change.path)) continue;
    if (typeof change.path !== "string" || typeof change.content !== "string") continue;

    const parts = change.path.replace(/\\/g, "/").split("/");
    if (!change.path || change.path.startsWith("/") ||
        parts.some(part => !part || part === "." || part === "..") ||
        /^[a-z]:/i.test(change.path)) continue;

    next[change.path] = change.content;
    applied.push(change.path);
  }

  return { files: next, applied };
}
