export declare type ProgressBarTokens = {
    [key: string]: string;
};
export declare type ProgressBarFunc = (percentComplete: number, tokens?: ProgressBarTokens) => void;
/**
 * Returns a function `ProgressBarFunc` to be called progressively with `percentComplete`, and
 * an optional map of `tokens` to be interpolated into the format string.
 */
export default function progressBar(format: string, total?: number): ProgressBarFunc;
