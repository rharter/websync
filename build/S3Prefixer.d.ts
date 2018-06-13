export default class S3Prefixer {
    private replaceReg;
    readonly prefix: string;
    constructor(prefix?: string);
    withPrefix(key: string): string;
    withoutPrefix(key: string): string;
}
