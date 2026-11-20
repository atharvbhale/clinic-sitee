import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e", fullyParallel: true, retries: 0, reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3113", trace: "on-first-retry" },
  webServer: { command: "npm run build && npx next start -p 3113", url: "http://localhost:3113", reuseExistingServer: true, timeout: 180_000 },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 5"] } }],
});
