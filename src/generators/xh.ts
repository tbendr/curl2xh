import {
  _toHttpie,
  toHttpieWarn,
  supportedArgs as supportedArgsHttpie,
} from "./httpie.js";
import type { Request, Warnings } from "../parse.js";

export const supportedArgs = supportedArgsHttpie;

export function _toXh(requests: Request[], warnings: Warnings = []): string {
  return _toHttpie(requests, warnings);
}

export function toXhWarn(
  curlCommand: string | string[],
  warnings: Warnings = [],
): [string, Warnings] {
  return toHttpieWarn(curlCommand, warnings);
}

export function toXh(curlCommand: string | string[]): string {
  return toXhWarn(curlCommand)[0];
}
