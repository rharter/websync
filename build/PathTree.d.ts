export declare class Node {
    name: string;
    path: string;
    children: Node[];
    parent: Node | null;
    constructor(name: string, path: string, parent?: Node);
    toJSON(): Partial<Node>;
}
export declare type WalkFn = (node: Node) => void;
export default class PathTree {
    private root;
    constructor(paths?: string[]);
    add(path: string): Node;
    lookup(path: string, context?: Node): Node | null;
    walk(pathOrNode: Node | string, fn: WalkFn): void;
    countAllChildren(pathOrNode?: Node | string, onlyFiles?: boolean): number;
    countDirectChildren(pathOrNode?: Node | string): number;
}
