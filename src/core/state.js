/**
 * ModX Studio — creación y normalización del estado inicial.
 */
import { readLocalState } from "../storage/local-storage.js";

export function createAppState(key, createStarterProject) {
  try {
    const state = readLocalState(key);

    if (state && state.projects?.length) {
      state.providers = state.providers || [];
      state.providers.forEach(provider => {
        provider.models = provider.models || [];

        if ((provider.url || "").includes("integrate.api.nvidia.com")) {
          provider.model = "nvidia/nemotron-3-ultra-550b-a55b";
          provider.models = ["nvidia/nemotron-3-ultra-550b-a55b"];
        }
      });

      return state;
    }
  } catch {
    // Si los datos locales no se pueden leer, se inicia un proyecto nuevo.
  }

  const project = createStarterProject();

  return {
    projects: [project],
    active: project.id,
    providers: [
      {
        name: "NVIDIA Build",
        url: "https://integrate.api.nvidia.com/v1",
        model: "nvidia/nemotron-3-ultra-550b-a55b",
        key: "",
        models: []
      },
      {
        name: "OpenAI",
        url: "https://api.openai.com/v1",
        model: "gpt-4.1-mini",
        key: "",
        models: []
      }
    ]
  };
}
