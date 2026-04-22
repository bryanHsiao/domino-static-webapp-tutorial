import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "../hello-webapp/src/main/resources/WebContent/step2"),
    emptyOutDir: false,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "assets/app.css";
          }
          return "assets/[name].[ext]";
        }
      }
    }
  }
});
