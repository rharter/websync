export declare type Listener = (...args: any[]) => void | Promise<void>;
/**
 * Simple EventEmitter that supports `async` listeners (listeners that return a `Promise`)
 * @NOTE: Not attempting to be, nor close to being, a mirror implementation of the native `EventEmitter`
 */
export default class AsyncEventEmitter {
    private _events;
    on(event: string, listener: Listener): this;
    once(event: string, listener: Listener): this;
    removeListener(event: string, listener: Listener): void;
    removeAllListeners(event?: string): void;
    emit(event: string, ...args: any[]): Promise<boolean>;
}
