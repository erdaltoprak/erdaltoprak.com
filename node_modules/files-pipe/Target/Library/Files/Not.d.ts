import type { Option, Plan } from "../../Option/Index.js";
/**
 * The function `Not` filters out files from the `Files` array based on the provided `Pattern`
 * parameter.
 * @param Pattern - The `Pattern` parameter is of type `Option["Exclude"]`. It represents the patterns
 * or filters that will be used to exclude certain files from the `Files` array.
 * @param Files - The `Files` parameter is expected to be an array of results from a plan. Each element
 * in the array should be an array itself, with two elements. The first element represents the file
 * name, and the second element represents the file content.
 * @returns the modified `Files` set after applying the filters.
 */
declare const _default: (Pattern: Option["Exclude"], Files: Plan["Results"]) => Promise<Map<string, string>>;
export default _default;
