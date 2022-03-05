export interface PayloadPlugin {
    pid?: number;
    srid: number;
    descript: string;
    name: string;
    url: string;
    env: string;
}

export interface PluginInfoModel {
    url: string;
    env: string;
    sampleOfResponse: any;
    sampleOfRequest: any;
}