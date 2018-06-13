import { WebsyncOptions } from './Websync';
export interface ConfigFile extends WebsyncOptions {
}
export interface ConfigOptions {
    argv?: string[];
    configFileName?: string;
}
export default class Config {
    private argv;
    private configFileName;
    constructor({argv, configFileName}: ConfigOptions);
    private getDefaultConfigFileName();
    private readConfigFile();
    resolve(): Promise<ConfigFile>;
}
