export interface GlobMap<T> {
    [key: string]: T;
}
export default class GlobTable<T> {
    private map;
    constructor(map: GlobMap<T>);
    lookup(key: string): T[];
}
