/// <reference types="node" />
import * as fs from 'fs-extra';
import { Item } from './types';
export default class FileItem implements Item {
    private baseDirectory;
    private computedEtag?;
    key: string;
    modtime: Date;
    size: number;
    isSymbolicLink: boolean;
    constructor(baseDirectory: string, fileName: string, stats: fs.Stats);
    etag(): string;
    private static computeEtag(filepath);
    read(): Promise<Buffer>;
    static fromFileName(baseDirectory: string, fileName: string): Promise<FileItem>;
}
