import { CloudFront } from 'aws-sdk';
import { ItemDiff } from './types';
export interface StatsObject {
    source: string;
    target: string;
    diffs: ItemDiff[];
    distributions?: CloudFront.DistributionSummary[];
    invalidations?: string[];
    constitutesPayment: boolean;
    completed: boolean;
    invalidated: boolean;
    time: number;
    amount: number;
}
export default class Stats implements StatsObject {
    source: string;
    target: string;
    diffs: ItemDiff[];
    distributions?: CloudFront.DistributionSummary[];
    invalidations?: string[];
    constitutesPayment: boolean;
    completed: boolean;
    invalidated: boolean;
    time: number;
    amount: number;
    constructor(stats?: Partial<StatsObject>);
    private diffToString(chalk, diff);
    private getDistributionName(dist);
    update(stats: Partial<StatsObject>): void;
    toString({colors}?: {
        colors?: boolean;
    }): string;
    clone(): Stats;
}
