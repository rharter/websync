import { Container, ContainerType, ListItemsOptions, Item } from './types';
export default class FileContainer implements Container {
    private baseDirectory;
    type: ContainerType;
    constructor(baseDirectory: string);
    private getDir();
    private readAllFileNames();
    listItems(options?: ListItemsOptions): Promise<Item[]>;
    putItem(item: Item): Promise<Item>;
    delItem(item: Item): Promise<void>;
}
