#!/usr/bin/env -S npx tsx
import { version } from "../package.json";
import { download } from "./commands/download.js";
import { local } from "./commands/local.js";
import { openai } from "./commands/openai.js";
import { openrouter } from "./commands/openrouter.js";
import { cli } from "./cli.js";
import { azure } from "./commands/gemini.js";

cli()
  .name("humanify")
  .description("Unminify code using OpenAI's API, OpenRouter's API or a local LLM")
  .version(version)
  .addCommand(local)
  .addCommand(openai)
  .addCommand(openrouter)
  .addCommand(azure)
  .addCommand(download())
  .parse(process.argv);
