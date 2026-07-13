import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig(({ mode }) => ({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ["react-timer-hook"],
  },
  optimizeDeps: {
    include: ["react-timer-hook"],
  },
  plugins:
    mode === "test"
      ? []
      : (lazyPlugins(() => [
          tailwindcss(),
          tanstackStart({
            srcDirectory: "src",
            router: {
              routesDirectory: "routes",
            },
          }),
          react(),
          nitro(),
        ]) ?? []),
}));
