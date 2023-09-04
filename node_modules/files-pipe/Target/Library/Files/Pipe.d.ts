import type { Execution, Plan } from "../../Option/Index.js";
/**
 * The function `Pipe` takes a `Plan` and an `Execution` object as input, and performs a series of
 * operations based on the plan, handling various callbacks and error handling along the way.
 * @param {Plan} Plan - The `Plan` parameter is an object that represents the execution plan. It
 * contains information about the tasks to be executed and their corresponding inputs and outputs.
 * @param {Execution}  - - `Plan`: The plan object that contains the tasks to be executed.
 * @returns The function `Pipe` returns the modified `Plan` object.
 */
declare const _default: (Plan: Plan, { Fulfilled, Failed, Accomplished, Changed, Passed, Read, Wrote }: Execution) => Promise<Plan>;
export default _default;
