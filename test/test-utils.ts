import * as curl2xh from "../src/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const fixturesDir = path.resolve(__dirname, "../../test/fixtures");

const converters = {
  xh: {
    name: "xh",
    extension: ".sh",
    converter: curl2xh.toXh,
  },
} as const;

type Converter = keyof typeof converters;

export { converters };
export type { Converter };
