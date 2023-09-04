import type { Path, Plan } from "../../Option/Index.js";
/**
 * The function `In` takes a `Path` and a `Paths` object, and adds the `Path` to the `Paths` object.
 * @param {Path} Path - The `Path` parameter is a string or URL that represents the path to a file or
 * directory.
 * @param Paths - Paths is a variable of type Plan["Paths"]. It is likely an object or a map that
 * stores key-value pairs.
 * @returns The function `In` returns the `Paths` object.
 */
declare const _default: (Path: Path, Paths: Plan["Paths"]) => Promise<Map<string, string>>;
export default _default;
