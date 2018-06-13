import AsyncEventEmitter from './AsyncEventEmitter';
import { Item, ItemDiff, Container, S3PutModifier, S3DeleteModifier } from './types';
export interface TransferItemCompleteEvent {
    type: ItemDiff['type'];
    item: Item;
    success: boolean;
    time: number;
}
export interface TransferEmitter {
    emit(event: 'putObject', item: Item, options: S3PutModifier): Promise<boolean>;
    on(event: 'putObject', listener: (key: string, options: S3PutModifier) => void): this;
    emit(event: 'delObject', item: Item, options: S3DeleteModifier): Promise<boolean>;
    on(event: 'delObject', listener: (key: string, options: S3DeleteModifier) => void): this;
    emit(event: 'itemComplete', data: TransferItemCompleteEvent): Promise<boolean>;
    on(event: 'itemComplete', listener: (data: TransferItemCompleteEvent) => void): this;
}
export interface TransferOptions {
    source: Container;
    target: Container;
    diffs: ItemDiff[];
    concurrency?: number;
}
export default class Transfer extends AsyncEventEmitter implements TransferEmitter {
    private source;
    private target;
    private diffs;
    private concurrency;
    constructor(options: TransferOptions);
    private completeItem(start, type, item, promise);
    complete(): Promise<any>;
}
