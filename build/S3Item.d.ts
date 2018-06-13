/// <reference types="node" />
import { S3 } from 'aws-sdk';
import { Item } from './types';
import S3Prefixer from './S3Prefixer';
export default class S3Item extends S3Prefixer implements Item {
    private s3Object;
    private bucketName;
    private remoteEtag;
    key: string;
    modtime: Date;
    size: number;
    isSymbolicLink: boolean;
    constructor(bucketName: string, s3Object: S3.Object, prefix?: string);
    private getBody();
    read(): Promise<Buffer>;
    etag(): string;
}
