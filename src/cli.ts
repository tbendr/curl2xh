#!/usr/bin/env node

import { CCError } from "./utils.js";
import type { Warnings } from "./Warnings.js";
import { Word } from "./shell/Word.js";
import {
  parseArgs,
  curlLongOpts,
  curlLongOptsShortened,
  curlShortOpts,
} from "./curl/opts.js";
import type { LongOpts, ShortOpts } from "./curl/opts.js";
import { buildRequests } from "./Request.js";
import type { Request } from "./Request.js";
import {
  _toXh,
  toXhWarn,
  supportedArgs as supportedArgsXh,
} from "./generators/xh.js";
import fs from "fs";

const VERSION = "4.12.0 (curl 8.2.1)";

const USAGE = `Usage: curl2xh [-] [curl_options...]\n\n-: read curl command from stdin\n--verbose/-v: print warnings and error tracebacks\n`;

const longOpts: LongOpts = {
  ...curlLongOpts,
  stdin: { type: "bool", name: "stdin" },
};
const shortOpts: ShortOpts = {
  ...curlShortOpts,
  "": "stdin",
};

function printWarnings(warnings: Warnings, verbose: boolean): Warnings {
  if (!verbose) {
    return warnings;
  }
  for (const w of warnings) {
    for (const line of w[1].trim().split("\n")) {
      console.error("warning: " + line);
    }
  }
  return [];
}

function exitWithError(error: unknown, verbose = false): never {
  let errMsg: Error | string | unknown = error;
  if (!verbose) {
    if (error instanceof CCError) {
      errMsg = "";
      for (const line of error.message.toString().split("\n")) {
        errMsg += "error: " + line + "\n";
      }
      errMsg = (errMsg as string).trimEnd();
    } else if (error instanceof Error) {
      errMsg = error.toString();
    }
  }
  console.error(errMsg);
  process.exit(2);
}

const argv = process.argv.slice(1).map((arg) => new Word(arg));
let global_, seenArgs;
let warnings: Warnings = [];
try {
  [global_, seenArgs] = parseArgs(
    argv,
    longOpts,
    curlLongOptsShortened,
    shortOpts,
    undefined,
    warnings,
  );
} catch (e) {
  exitWithError(e);
}

if (global_.help) {
  console.log(USAGE.trim());
  process.exit(0);
}
if (global_.version) {
  console.log("curl2xh " + VERSION);
  process.exit(0);
}

const verbose = !!global_.verbose;
const commandFromStdin = global_.stdin;

const extraArgs = seenArgs.filter((a) => {
  const [arg, actual] = a;
  const ignore = ["stdin", "verbose"].includes(arg);
  if (!ignore && !supportedArgsXh.has(arg)) {
    warnings.push([arg, actual + " is not a supported option"]);
  }
  return !ignore;
});

let code;
if (commandFromStdin) {
  if (extraArgs.length > 0) {
    const extraArgsStr = extraArgs.map((a) => a[1]).join(", ");
    exitWithError(
      new CCError(
        "if you pass --stdin or -, you can't also pass " + extraArgsStr,
      ),
      verbose,
    );
  }
  const input = fs.readFileSync(0, "utf8");
  try {
    [code, warnings] = toXhWarn(input, warnings);
  } catch (e) {
    printWarnings(warnings, true);
    exitWithError(e, verbose);
  }
  warnings = printWarnings(warnings, verbose);
} else {
  warnings = printWarnings(warnings, verbose);

  let stdin;
  if (!process.stdin.isTTY) {
    stdin = new Word(fs.readFileSync(0).toString());
  }
  let requests: Request[];
  try {
    requests = buildRequests(global_, stdin);
  } catch (e) {
    exitWithError(e, verbose);
  }
  warnings = printWarnings(warnings, verbose);
  if (requests[0].urls[0].originalUrl.startsWith("curl ")) {
    console.error(
      `warning: Passing a whole curl command as a single argument?\nwarning: Pass options to curl2xh as if it was curl instead:\nwarning: curl2xh 'curl example.com' -> curl2xh example.com`,
    );
  }
  try {
    code = _toXh(requests, warnings);
  } catch (e) {
    exitWithError(e, verbose);
  }
  warnings = printWarnings(warnings, verbose);
}

printWarnings(warnings, verbose);
process.stdout.write(code);
