import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        postDetail: resolve(__dirname, "post-detail.html"),
        addEditPost: resolve(__dirname, "add-edit-post.html"),
      },
    },
  },
});
