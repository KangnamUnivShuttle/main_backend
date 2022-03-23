export interface PayloadPlugin {
    pid?: number;
    srid: number;
    descript: string;
    name: string;
    url: string;
    env: string;
}

export interface PluginInfoModel {
    port: string;
    url: string;
    env: string;
    sampleOfResponse: any;
    sampleOfRequest: any;
}