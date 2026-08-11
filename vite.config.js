import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/teorikaModule.js"),
      name: "TeorikaCDP",
      fileName: () => "teorikaModule.js",
      formats: ["iife"],
    },
    outDir: "dist",
    minify: "esbuild",
  },
});
