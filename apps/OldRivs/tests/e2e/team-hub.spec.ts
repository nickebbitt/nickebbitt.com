import { expect, test } from "@playwright/test";

test("shows the public team hub with club-maintained results and standings", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "UNDER 13s" })).toBeVisible();
  await expect(page.getByText("Tiki Taka U13 Leverkusen")).toBeVisible();
  await page.getByRole("button", { name: "Show match statistics" }).click();
  await expect(page.getByText("Goal", { exact: true }).first()).toBeVisible();
  await page.getByRole("tab", { name: "Table" }).click();
  await expect(page.getByRole("tab", { name: "Table", selected: true })).toBeVisible();
  await expect(page.getByText("Old Rivingtonians", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Stats" }).click();
  await expect(page.getByRole("tab", { name: "Stats", selected: true })).toBeVisible();
});
