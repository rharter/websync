/// <reference types="node" />
import { S3 } from 'aws-sdk';
export declare type S3PutModifier = Partial<S3.PutObjectRequest>;
export declare type S3DeleteModifier = Partial<S3.DeleteObjectRequest>;
export interface FilterOptions {
    include?: string;
    exclude?: string;
}
export interface Item {
    key: string;
    modtime: Date;
    size: number;
    isSymbolicLink: boolean;
    etag(): string;
    read(): Promise<Buffer>;
}
export declare type ContainerType = 'FILE' | 'S3';
export interface ListItemsOptions extends FilterOptions {
}
export interface PutItemOptions {
    s3Options?: S3PutModifier;
}
export interface DelItemOptions {
    s3Options?: S3DeleteModifier;
}
export interface Container {
    type: ContainerType;
    listItems(options?: ListItemsOptions): Promise<Item[]>;
    putItem(item: Item, options?: PutItemOptions): Promise<Item>;
    delItem(item: Item, options?: DelItemOptions): Promise<void>;
}
export declare type ItemDiffType = 'UPDATE' | 'CREATE' | 'DELETE';
export declare type ItemDiffUpdate = {
    type: 'UPDATE';
    key: string;
    source: Item;
    target: Item;
};
export declare type ItemDiffCreate = {
    type: 'CREATE';
    key: string;
    source: Item;
};
export declare type ItemDiffDelete = {
    type: 'DELETE';
    key: string;
    target: Item;
};
export declare type ItemDiff = ItemDiffUpdate | ItemDiffCreate | ItemDiffDelete;
export interface Invalidation {
    path: string;
    forDiff: ItemDiff;
}
