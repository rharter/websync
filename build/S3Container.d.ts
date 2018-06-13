import S3Prefixer from './S3Prefixer';
import { Item, Container, ContainerType, ListItemsOptions, PutItemOptions, DelItemOptions } from './types';
export default class S3Container extends S3Prefixer implements Container {
    private bucketName;
    type: ContainerType;
    constructor(bucketName: string, prefix?: string);
    private listAllObjects();
    listItems(options?: ListItemsOptions): Promise<Item[]>;
    putItem(item: Item, options?: PutItemOptions): Promise<Item>;
    delItem(item: Item, options?: DelItemOptions): Promise<void>;
    getBucketName(): string;
}
