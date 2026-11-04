/**
 * ModX Studio — registro centralizado de eventos de interfaz.
 * Las operaciones concretas se reciben desde la aplicación.
 */
export function bindAppEvents({ $, $$, handlers }) {
  const on = (id, event, callback) => {
    const element = $("#" + id);
    if (element) element.addEventListener(event, callback);
  };

  $$(".nav[data-view]").forEach(button => {
    button.addEventListener("click", () => handlers.view(button.dataset.view));
  });

  on("menu", "click", handlers.toggleMenu);
  on("sidebarClose", "click", handlers.closeSidebar);
  on("newProject", "click", handlers.newProject);
  on("rename", "click", handlers.renameProject);
  on("newChat", "click", handlers.newChat);
  on("clearHistory", "click", handlers.clearHistory);
  on("send", "click", handlers.sendMessage);
  on("prompt", "keydown", handlers.promptKeydown);
  on("prompt", "input", handlers.promptInput);
  on("browse", "click", handlers.browseFiles);
  on("import", "click", handlers.openFilePicker);
  on("attach", "click", handlers.openFilePicker);
  on("fileInput", "change", handlers.importFiles);
  on("export", "click", handlers.exportAddon);
  on("addFile", "click", handlers.addFile);
  on("saveFile", "click", handlers.saveFile);
  on("undo", "click", handlers.undo);
  on("redo", "click", handlers.redo);
  on("validate", "click", handlers.validate);
  on("renderModel", "click", handlers.renderModel);
  on("geometryFile", "change", handlers.renderModel);
  on("settingsOpen", "click", handlers.openSettings);

  $$("[data-close]").forEach(button => {
    button.addEventListener("click", handlers.closeSettings);
  });

  on("settings", "click", handlers.settingsBackdrop);
  on("addProvider", "click", handlers.addProvider);
  on("saveProvider", "click", handlers.saveProvider);
  on("test", "click", handlers.testProvider);
  on("loadModels", "click", handlers.loadModels);
  on("pModelSelect", "change", handlers.selectModel);
  on("applyPreset", "click", handlers.applyPreset);
  on("showKey", "click", handlers.toggleKeyVisibility);

  $$("[data-tab]").forEach(button => {
    button.addEventListener("click", () => handlers.selectSettingsTab(button));
  });

  on("clearData", "click", handlers.clearData);
  on("generateImage", "click", handlers.generateImage);
  on("askTexture", "click", handlers.askTexture);
}
