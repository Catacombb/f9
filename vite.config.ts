import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Dynamically import the module only in development mode
  const plugins: PluginOption[] = [react()];
  
  if (mode === 'development') {
    try {
      // Use dynamic import to load the ESM module
      const { componentTagger } = await import("lovable-tagger");
      // Call the function to get the plugin and add it to the array
      const taggerPlugin = componentTagger() as PluginOption;
      plugins.push(taggerPlugin);
    } catch (error) {
      console.warn("Failed to load lovable-tagger plugin:", error);
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
