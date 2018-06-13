import { CloudFront } from 'aws-sdk';
export declare const bucketToDomain: (bucketName: string) => string;
export declare function listDistributions(): Promise<CloudFront.DistributionSummary[]>;
export interface FindDistributionsOptions {
    bucketName?: string;
    ids?: string[];
}
export declare function findDistributions({bucketName, ids}: FindDistributionsOptions): Promise<CloudFront.DistributionSummary[]>;
export interface CloudFrontInvalidatorOptions {
    bucketName: string;
    paths: string[];
    ids?: string[];
}
export interface InvalidateResponse {
    committed: boolean;
    count: number;
    reason: 'NO_PATHS' | 'NO_DISTS' | 'COMMITTED';
}
export default class CloudFrontInvalidator {
    readonly bucketName: string;
    readonly paths: string[];
    readonly ids: string[];
    private distributions;
    constructor(options: CloudFrontInvalidatorOptions);
    constitutesPayment(): Promise<boolean>;
    invalidate(enabledOnly?: boolean): Promise<InvalidateResponse>;
    getDistributions(): Promise<CloudFront.DistributionSummary[]>;
}
