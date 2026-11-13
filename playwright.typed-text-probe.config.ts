import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testDir: "./e2e/probe",
  testMatch: "typed-text-platform.probe.ts",
  outputDir: "e2e/probe-results",
  fullyParallel: false,
  workers: 1,
  retries: 0
});
