/// <reference types="node" />
import { EventEmitter } from 'events';
import { S3PutModifier, S3DeleteModifier, Item } from './types';
import { TransferItemCompleteEvent } from './Transfer';
import Stats from './Stats';
import { DiffKey } from './diff';
import { WildcardPolicy } from './generateInvalidations';
export declare type WebsyncModifier<T> = T | ((item: Item) => T | Promise<T>);
export interface WebsyncPutModifiers {
    [key: string]: WebsyncModifier<S3PutModifier>;
}
export interface WebsyncDeleteModifiers {
    [key: string]: WebsyncModifier<S3DeleteModifier>;
}
export interface WebsyncTransferProgressEvent extends TransferItemCompleteEvent {
    progress: number;
}
export interface WebsyncEmitter {
    emit(event: 'progress', eventData: WebsyncTransferProgressEvent): boolean;
    on(event: 'progress', listener: (eventData: WebsyncTransferProgressEvent) => void): this;
}
export interface WebsyncOptions {
    source: string;
    target: string;
    include?: string;
    exclude?: string;
    diffBy?: DiffKey;
    modifiers?: WebsyncPutModifiers;
    deleteModifiers?: WebsyncDeleteModifiers;
    wildcardPolicy?: WildcardPolicy;
    wildcardAll?: boolean;
    invalidateDeletes?: boolean;
    distributions?: string[];
}
export default class Websync extends EventEmitter implements WebsyncEmitter {
    private source;
    private target;
    private filterOptions;
    private putOptionsTable;
    private deleteOptionsTable;
    private diffBy?;
    private wildcardPolicy;
    private wildcardAll;
    private invalidateDeletes;
    private initialized;
    private completed;
    private diffs;
    private stats;
    private transfer?;
    private invalidations;
    private invalidator;
    private distributions?;
    private completeCount;
    constructor(options: WebsyncOptions);
    initialize(): Promise<void>;
    constitutesPayment(): boolean;
    sync(invalidate?: boolean): Promise<Stats>;
    getStats(): Stats;
}
