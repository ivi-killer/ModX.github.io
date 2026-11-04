/**
 * Validación básica e independiente de los archivos de un proyecto Bedrock.
 */
export function validateProjectFiles(files) {
  const errors = [];
  const warnings = [];

  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith(".json") && !content.startsWith("__BASE64__:")) {
      try {
        JSON.parse(content);
      } catch (error) {
        errors.push(path + ": JSON inválido — " + error.message);
      }
    }
  }

  const manifests = Object.entries(files).filter(([path]) => path.endsWith("manifest.json"));

  if (!manifests.some(([path]) => path.startsWith("behavior_pack/"))) {
    warnings.push("Falta behavior_pack/manifest.json");
  }
  if (!manifests.some(([path]) => path.startsWith("resource_pack/"))) {
    warnings.push("Falta resource_pack/manifest.json");
  }

  const uuids = [];
  for (const [path, content] of manifests) {
    try {
      const manifest = JSON.parse(content);
      const values = [
        manifest.header?.uuid,
        ...(manifest.modules || []).map(module => module.uuid)
      ];

      for (const uuid of values) {
        if (!uuid) continue;
        if (uuids.includes(uuid)) errors.push(path + ": UUID duplicado " + uuid);
        uuids.push(uuid);
      }

      if (
        manifest.header?.uuid &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(manifest.header.uuid)
      ) {
        warnings.push(path + ": UUID no parece v4");
      }
    } catch {
      // El error de sintaxis JSON ya se informa en la primera pasada.
    }
  }

  return { errors, warnings };
}
