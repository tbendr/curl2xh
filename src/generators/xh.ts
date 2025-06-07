import {
  _toHttpie,
  toHttpieWarn,
  supportedArgs as supportedArgsHttpie,
} from "./httpie.js";
import type { Request, Warnings } from "../parse.js";

export const supportedArgs = supportedArgsHttpie;

export function _toXh(requests: Request[], warnings: Warnings = []): string {
  const httpie = _toHttpie(requests, warnings);
  return httpie.replace(/^https(?= )/gm, "xhs").replace(/^http(?= )/gm, "xh");
}

export function toXhWarn(
  curlCommand: string | string[],
  warnings: Warnings = [],
): [string, Warnings] {
  const [httpie, warns] = toHttpieWarn(curlCommand, warnings);
  const xh = httpie
    .replace(/^https(?= )/gm, "xhs")
    .replace(/^http(?= )/gm, "xh");
  return [xh, warns];
}

export function toXh(curlCommand: string | string[]): string {
  return toXhWarn(curlCommand)[0];
}
