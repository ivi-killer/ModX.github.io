/**
 * ModX Studio — acceso centralizado al almacenamiento local heredado.
 * Esta capa permite sustituir localStorage por IndexedDB en F2 sin
 * repartir accesos directos por toda la aplicación.
 */
export function readLocalState(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function writeLocalState(key, state) {
  localStorage.setItem(key, JSON.stringify(state));
}
