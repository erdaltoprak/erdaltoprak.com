/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Pattern } from "fast-glob";
import type { Stream } from "stream";
/**
 * Represents the possible debugging levels.
 */
export type Debug = 0 | 1 | 2;
/**
 * Represents various types that can be used as buffer data.
 */
export type Buffer = string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream;
/**
 * Represents the execution configuration for specific actions on files.
 */
export interface Execution {
    /**
     * Attaches a callback for the fulfillment of the Execution.
     * @param Plan The execution plan to be fulfilled.
     * @returns A Promise that resolves to either a string or false.
     */
    Fulfilled?: boolean | ((Plan: Plan) => Promise<false | string>);
    /**
     * Attaches a callback for handling failures in the Execution.
     * @param Input The input file being processed.
     * @param _Error The error encountered during execution.
     * @returns A Promise that resolves to either a string or false.
     */
    Failed?: boolean | ((Input: File, _Error: unknown) => Promise<false | string>);
    /**
     * Attaches a callback for actions that are accomplished.
     * @param On The file on which an action was accomplished.
     * @returns A Promise that resolves to either a string or false.
     */
    Accomplished?: boolean | ((On: File) => Promise<false | string>);
    /**
     * Attaches a callback for actions that result in changes to the plan.
     * @param Plan The execution plan to be changed.
     * @returns A Promise that resolves to the modified execution plan.
     */
    Changed?: (Plan: Plan) => Promise<Plan>;
    /**
     * Attaches a callback for actions that check if a file can pass through the pipe.
     * @param On The file on which the action is being checked.
     * @returns A Promise that resolves to a boolean value indicating if the file has passed the checks.
     */
    Passed?: (On: File) => Promise<Boolean>;
    /**
     * Attaches a callback for reading from a file.
     * @param On The file to be read.
     * @returns A Promise that resolves to the buffer read from the file.
     */
    Read?: (On: File) => Promise<Buffer>;
    /**
     * Attaches a callback for writing to a file.
     * @param On The file to be written to.
     * @returns A Promise that resolves to the buffer written to the file.
     */
    Wrote?: (On: File) => Promise<Buffer>;
}
/**
 * Represents criteria for excluding files.
 */
export type Exclude = string | RegExp | ((File: string) => boolean);
/**
 * Represents a path specification.
 */
export type Path = string | URL | Map<string | URL, string | URL> | false;
/**
 * Represents options for configuring the behavior of the program.
 */
export interface Option {
    [key: string]: any;
    /**
     * Configuration for the target path(s).
     */
    Path?: Path | Path[] | Set<Path>;
    /**
     * Criteria for excluding files.
     */
    Exclude?: Exclude | Exclude[] | Set<Exclude>;
    /**
     * File patterns to be matched.
     */
    Files?: Pattern | Pattern[];
    /**
     * Execution pipe configuration.
     */
    Pipe?: Execution;
    /**
     * Debugging level.
     */
    Logger?: Debug;
}
/**
 * Represents the execution plan.
 */
export interface Plan {
    /**
     * The debugging level for the execution plan.
     */
    Debug: Debug;
    /**
     * The number of files in the execution plan.
     */
    Files: number;
    /**
     * Additional information associated with the execution plan.
     */
    Info: any;
    /**
     * Mapping of input paths to output paths.
     */
    Paths: Map<Dir["Input"], Dir["Output"]>;
    /**
     * Mapping of result paths to corresponding input paths.
     */
    Results: Map<`${Dir["Output"]}${File["Output"]}`, `${Dir["Input"]}${File["Input"]}`>;
    /**
     * The file currently being operated on.
     */
    On: File;
}
/**
 * Represents a directory specification.
 */
export interface Dir {
    /**
     * The input directory.
     */
    Input: string;
    /**
     * The output directory.
     */
    Output: string;
}
/**
 * Represents a file specification.
 */
export interface File {
    /**
     * The input file.
     */
    Input: string;
    /**
     * The output file.
     */
    Output: string;
    /**
     * The size after the action.
     */
    After: number;
    /**
     * The size before the action.
     */
    Before: number;
    /**
     * The buffer data.
     */
    Buffer: Buffer;
}
/**
 * Default configuration object.
 */
declare const _default: {
    /**
     * Configuration for the target path(s).
     */
    Path: string;
    /**
     * Debugging level.
     */
    Logger: 2;
    /**
     * Execution pipe configuration.
     */
    Pipe: {
        /**
         * Attaches a callback for reading from a file.
         */
        Read: (On: File) => Promise<string>;
        /**
         * Attaches a callback for writing to a file.
         */
        Wrote: (On: File) => Promise<Buffer>;
        /**
         * Attaches a callback for actions that check if a file can pass through the pipe.
         */
        Passed: (On: File) => Promise<boolean>;
        /**
         * Attaches a callback for handling failures in the Execution.
         */
        Failed: (On: File) => Promise<string>;
        /**
         * Attaches a callback for actions that are accomplished.
         */
        Accomplished: (On: File) => Promise<string>;
        /**
         * Attaches a callback for the fulfillment of the Execution.
         */
        Fulfilled: (Plan: Plan) => Promise<string | false>;
        /**
         * Attaches a callback for actions that result in changes to the plan.
         */
        Changed: (Plan: Plan) => Promise<Plan>;
    };
};
export default _default;
