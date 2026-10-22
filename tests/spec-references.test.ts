// SPDX-License-Identifier: Apache-2.0
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const atRoot = (path: string) => new URL(`../${path}`, import.meta.url);
const read = (path: string) => readFileSync(atRoot(path), "utf8");
describe("normative protocol references", () => {
  it("links to the shipped SPEC.md from code, tests and the MCP README", () => {
    expect(existsSync(atRoot("SPEC.md"))).toBe(true);
    expect(read("src/index.ts")).toContain("// Spec: SPEC.md");
    expect(read("src/frames.ts")).toContain("// Spec: SPEC.md");
    expect(read("tests/tclk.test.ts")).toContain("anti-drift gate for SPEC.md");
    const mcpReadme = read("mcp/README.md");
    expect(mcpReadme).toContain("[`SPEC.md`](https://github.com/flop-labs/tclk/blob/main/SPEC.md)");
    for (const path of ["src/index.ts", "src/frames.ts", "tests/tclk.test.ts", "mcp/README.md"]) {
      expect(read(path)).not.toMatch(/technocore-lock-protocol\.md|repository's design docs/);
    }
  });
});
