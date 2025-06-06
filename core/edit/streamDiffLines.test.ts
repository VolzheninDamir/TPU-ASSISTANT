// Generated by continue

import { addIndentation } from "./streamDiffLines";
import type { DiffLine } from "../index";

describe("addIndentation", () => {
  async function* mockDiffLineGenerator(lines: DiffLine[]) {
    for (const line of lines) {
      yield line;
    }
  }

  test("should add indentation to each line", async () => {
    const lines: DiffLine[] = [
      { type: "same", line: "Line 1" },
      { type: "new", line: "Line 2" },
      { type: "old", line: "Line 3" },
    ];
    const indentation = "  ";

    const generator = addIndentation(mockDiffLineGenerator(lines), indentation);

    const result: DiffLine[] = [];
    for await (const diffLine of generator) {
      result.push(diffLine);
    }

    expect(result).toEqual([
      { type: "same", line: "  Line 1" },
      { type: "new", line: "  Line 2" },
      { type: "old", line: "  Line 3" },
    ]);
  });

  test("should handle empty generator", async () => {
    const lines: DiffLine[] = [];
    const indentation = "\t";

    const generator = addIndentation(mockDiffLineGenerator(lines), indentation);

    const result: DiffLine[] = [];
    for await (const diffLine of generator) {
      result.push(diffLine);
    }

    expect(result).toEqual([]);
  });

  test("should handle no indentation", async () => {
    const lines: DiffLine[] = [{ type: "same", line: "Line 1" }];
    const indentation = "";

    const generator = addIndentation(mockDiffLineGenerator(lines), indentation);

    const result: DiffLine[] = [];
    for await (const diffLine of generator) {
      result.push(diffLine);
    }

    expect(result).toEqual([{ type: "same", line: "Line 1" }]);
  });

  test("should propagate errors from the source generator", async () => {
    async function* errorGenerator(): AsyncGenerator<DiffLine> {
      throw new Error("Test error");
    }
    const indentation = "  ";

    const generator = addIndentation(errorGenerator(), indentation);

    await expect(async () => {
      for await (const _ of generator) {
        // Consume the generator
      }
    }).rejects.toThrow("Test error");
  });
});
