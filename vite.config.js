import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
});

/// the vite config file allows you to make custom config options to the build. Here, I've added source mapping for CSS, which means in dev tools, we can see the file and line number where certain styles for elements are - will send you a linkie
