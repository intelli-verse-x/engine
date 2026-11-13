import { strict as assert } from "node:assert";
import { screenshotBaseline } from "./screenshot-baseline.ts";

const approved = {
  platform: "darwin",
  architecture: "arm64",
  browserVersion: "140.0.7339.16",
  imageOS: "macos26",
  imageVersion: "20261102.0473.1"
};
const typed = "Text_text-typed.jpg";
assert.equal(screenshotBaseline(typed, approved), "Text_text-typed.macos-arm64-chromium140.jpg");
for (const changed of [
  { architecture: "x64" },
  { platform: "linux" },
  { platform: "win32" }
]) {
  assert.equal(screenshotBaseline(typed, { ...approved, ...changed }), typed);
}
for (const changed of [
  { browserVersion: "141.0.0.0" },
  { imageOS: "macos15" },
  { imageVersion: "20261109.1" },
  { imageOS: undefined },
  { imageVersion: undefined }
]) {
  assert.throws(() => screenshotBaseline(typed, { ...approved, ...changed }), /requires review/);
}
assert.equal(screenshotBaseline("Text_other.jpg", { ...approved, browserVersion: "unknown" }), "Text_other.jpg");
console.log("10 platform/reference selection boundary cases passed; zero threshold belongs to unchanged comparison.");
