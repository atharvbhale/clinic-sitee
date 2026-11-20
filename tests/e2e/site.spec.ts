import { test, expect } from "@playwright/test";

test("header navigation reaches every core page", async ({ page, isMobile }) => {
  for (const [label, heading] of [["About", /Atul Bhale/], ["Approach", /approach/i], ["Conditions", /Areas of practice/i], ["Consultation", /What to expect/i], ["FAQs", /Frequently asked/i], ["Contact", /Visit the clinic/i]] as const) {
    await page.goto("/");
    if (isMobile) await page.getByText("Menu", { exact: true }).click();
    await page.getByRole("navigation", { name: isMobile ? "Mobile" : "Primary" }).getByRole("link", { name: label }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});
test("skip link is first focusable element", async ({ page }) => {
  await page.goto("/"); await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
test("mobile action bar has a 44px+ Book target", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto("/");
  const box = await page.getByRole("navigation", { name: "Quick actions" }).getByRole("link", { name: "Book" }).boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
test("booking form shows errors for empty submit", async ({ page }) => {
  await page.goto("/book"); await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Please enter your name")).toBeVisible();
  await expect(page.getByText("Enter a valid 10-digit Indian mobile number").or(page.getByText("Please enter your mobile number"))).toBeVisible();
});
test("booking form rejects an invalid phone", async ({ page }) => {
  await page.goto("/book");
  await page.getByLabel("Patient name").fill("Asha Patil"); await page.getByLabel("Mobile number").fill("12345");
  await page.getByLabel("What is your enquiry about?").selectOption("Skin");
  await page.getByLabel("Preferred time").selectOption("morning"); await page.getByLabel(/new or returning/).selectOption("new");
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Enter a valid 10-digit Indian mobile number")).toBeVisible();
});
test("FAQ accordion expands", async ({ page }) => {
  await page.goto("/faqs"); const q = page.getByText("What does a consultation cost?");
  await q.click(); await expect(page.getByText("The fee is being confirmed")).toBeVisible();
});
test("language switcher reaches /hi with lang attribute", async ({ page }) => {
  await page.goto("/"); await page.getByRole("link", { name: "हिन्दी" }).click();
  await expect(page).toHaveURL(/\/hi$/); await expect(page.locator("div[lang='hi']")).toBeVisible();
});
test("admin redirects to sign-in when signed out", async ({ page }) => {
  await page.goto("/admin"); await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Staff sign-in" })).toBeVisible();
});
test("custom 404", async ({ page }) => {
  const res = await page.goto("/does-not-exist"); expect(res!.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /could not find/i })).toBeVisible();
});
