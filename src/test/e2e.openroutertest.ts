import { test } from "node:test";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { mkdtempSync } from "fs";

test("OpenRouter e2e test", async () => {
  const tempDir = mkdtempSync(join(tmpdir(), "humanify-openrouter-test-"));
  const inputFile = join(tempDir, "input.js");
  const outputDir = join(tempDir, "output");

  // Create a simple minified JS file for testing
  const minifiedCode = `function a(b,c){return b+c;}var d=a(1,2);console.log(d);`;
  writeFileSync(inputFile, minifiedCode);

  try {
    // Run humanify with OpenRouter
    const command = `node dist/index.mjs openrouter --outputDir="${outputDir}" "${inputFile}"`;
    const result = execSync(command, {
      encoding: "utf8",
      env: {
        ...process.env,
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
      }
    });

    console.log("OpenRouter test output:", result);

    // Check if output file was created
    const outputFile = join(outputDir, "input.js");
    const outputContent = readFileSync(outputFile, "utf8");

    console.log("Output content:", outputContent);

    // Basic validation - output should be different from input and longer
    if (outputContent.length <= minifiedCode.length) {
      throw new Error("Output should be longer than input (unminified)");
    }

    if (outputContent === minifiedCode) {
      throw new Error("Output should be different from input");
    }

    console.log("OpenRouter test passed!");
  } catch (error) {
    if (error.message.includes("OPENROUTER_API_KEY")) {
      console.log("Skipping OpenRouter test - no API key provided");
      return;
    }
    throw error;
  }
});
