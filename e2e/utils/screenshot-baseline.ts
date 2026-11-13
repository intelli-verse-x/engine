export interface BaselineEnvironment {
  platform: string;
  architecture: string;
  browserVersion: string;
  imageOS?: string;
  imageVersion?: string;
}

/** Only this reviewed TypedText provenance may select the extra ARM reference. */
export function screenshotBaseline(imageName: string, environment: BaselineEnvironment): string {
  if (imageName !== "Text_text-typed.jpg" || environment.platform !== "darwin" || environment.architecture !== "arm64") {
    return imageName;
  }
  if (
    environment.browserVersion === "140.0.7339.16" &&
    environment.imageOS === "macos26" &&
    environment.imageVersion === "20261102.0473.1"
  ) {
    return "Text_text-typed.macos-arm64-chromium140.jpg";
  }
  throw new Error("TypedText ARM baseline requires review for this browser/runner image; do not borrow another platform reference.");
}
