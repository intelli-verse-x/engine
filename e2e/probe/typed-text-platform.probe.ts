import { test } from "@playwright/test";
import { screenshotWithThreshold } from "../utils/screenshot";
import * as fs from "fs/promises";

test("TypedText exact baseline platform diagnostic", async ({ page, browser }, testInfo) => {
  // Observe the existing offscreen canvas immediately before JPEG encoding.
  // Keep the original toBlob receiver, callback, MIME type and quality unchanged.
  await page.addInitScript(() => {
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      if (type === "image/jpeg" && this.width === 1200 && this.height === 800) {
        (window as any).__typedTextPreJpegPNG = this.toDataURL("image/png");
      }
      return originalToBlob.call(this, callback, type, quality);
    };
  });
  await fs.mkdir("e2e/diff", { recursive: true });
  try {
    await screenshotWithThreshold(page, {
      category: "Text",
      name: "text-typed",
      threshold: 0,
      diffPercentage: 0
    });
  } finally {
    const observed = await page.evaluate(() => ({
      png: (window as any).__typedTextPreJpegPNG as string | undefined,
      userAgent: navigator.userAgent,
      fonts: Array.from(document.fonts).map((font) => ({
        family: font.family,
        status: font.status,
        weight: font.weight,
        style: font.style
      }))
    }));
    if (observed.png) {
      const imagePath = testInfo.outputPath("TypedText-pre-jpeg.png");
      await fs.writeFile(imagePath, Buffer.from(observed.png.split(",")[1], "base64"));
      await testInfo.attach("TypedText pre-JPEG pixels", { path: imagePath, contentType: "image/png" });
    }
    const metadata = {
      browser: browser.version(),
      node: process.version,
      architecture: process.arch,
      runnerOS: process.env.RUNNER_OS,
      runnerArchitecture: process.env.RUNNER_ARCH,
      imageOS: process.env.ImageOS,
      imageVersion: process.env.ImageVersion,
      userAgent: observed.userAgent,
      fonts: observed.fonts,
      threshold: 0,
      diffPercentage: 0
    };
    const metadataPath = testInfo.outputPath("platform-metadata.json");
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    await testInfo.attach("TypedText platform metadata", { path: metadataPath, contentType: "application/json" });
  }
});
