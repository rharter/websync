import { Item, ItemDiff } from './types';
export declare const match: (path: string, pattern: string) => boolean;
export declare const normalizeInvalidationPath: (path: string, wildcard?: boolean) => string;
export declare const isInvalidated: (path: string, invalidations: string[]) => boolean;
export declare const shouldWildcard: (diffChildCount: number, itemChildCount: number, policy: WildcardPolicy) => boolean;
export declare type WildcardPolicy = 'minority' | 'majority' | 'unanimous';
export interface GenerateInvalidationsOptions {
    diffs: ItemDiff[];
    targetItems: Item[];
    wildcardPolicy?: WildcardPolicy;
    wildcardAll?: boolean;
    invalidateDeletes?: boolean;
}
export default function generateInvalidations({diffs, targetItems, wildcardPolicy, wildcardAll, invalidateDeletes}: GenerateInvalidationsOptions): string[];
