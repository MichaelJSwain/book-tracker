import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["./tests/intro.test.ts"], // avoid e2e
  }
});