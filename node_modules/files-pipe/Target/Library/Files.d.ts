import type { Pattern } from "fast-glob";
import type { Execution, Option, Path, Plan } from "../Option/Index.js";
export default class Files {
    /**
     * The function `Pipe` is a TypeScript async function that takes an optional `Execution`
     * parameter and returns the result of calling `Pipe` with `this.Plan` and `Execution`.
     * @param {Execution} Execution - The Execution parameter is an optional parameter that
     * specifies the execution strategy to be used in the Pipe function. It has a default value of
     * Default.Pipe, which means that if no Execution parameter is provided when calling the Pipe
     * function, it will use the default execution strategy.
     */
    Pipe: (Execution?: Execution) => Promise<Plan>;
    /**
     * The function `Not` takes a `File` parameter and excludes it from the `Plan.Results` array.
     * @param File - The parameter "File" is of type "Option['Exclude']".
     * @returns the current object (`this`) after performing some operations.
     */
    Not: (File: Option["Exclude"]) => Promise<this>;
    /**
     * The function `By` takes a file pattern or an array of file patterns and returns a promise that
     * resolves to the results of executing the patterns on the specified paths.
     * @param {Pattern | Pattern[]} [File=**/ By: (File?: Pattern | Pattern[]) => Promise<this>;
    /**
     * The function `In` takes a path and updates the `Plan.Paths` property with the input and output
     * paths.
     * @param {Path} [Path=./] - The `Path` parameter is a string that represents the path to a file or
     * directory. It has a default value of "./", which means it will use the current directory if no path
     * is provided.
     * @returns the value of `this`, which refers to the current object.
     */
    In: (Path?: Path) => Promise<this>;
    Plan: Plan;
    /**
     * The constructor function sets the debug level of a plan object.
     * @param [Debug=2] - The "Debug" parameter is a property of the "Plan" object. It is optional and has
     * a default value of 2.
     */
    constructor(Debug?: Plan["Debug"]);
}
