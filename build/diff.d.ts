import { Container, ItemDiff, FilterOptions } from './types';
export declare type DiffKey = 'modtime' | 'size' | 'etag';
export default function diff(source: Container, target: Container, diffKey?: DiffKey, filterOptions?: FilterOptions): Promise<ItemDiff[]>;
