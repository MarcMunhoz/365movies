import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readNetlifyConfig = () => readFileSync(resolve(process.cwd(), "netlify.toml"), "utf8");

const getContentSecurityPolicy = () => {
  const config = readNetlifyConfig();
  const match = config.match(/Content-Security-Policy\s*=\s*"([^"]+)"/);
  return match?.[1] || "";
};

describe("netlify config", () => {
  it("allows data image sources for the accessibility large cursor", () => {
    const contentSecurityPolicy = getContentSecurityPolicy();

    expect(contentSecurityPolicy).toContain("img-src");
    expect(contentSecurityPolicy).toMatch(/img-src[^;]*data:/);
  });
});
