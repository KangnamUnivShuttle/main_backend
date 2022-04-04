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
    order: number;
    env: string;
    sampleOfResponse: any;
    sampleOfRequest: any;
    runtime_order_num?: number;
    runtimeID?: number;
}

export interface PlugInImageModel {
    imageID?: number;
    name: string;
    order_num?: number;
    github_url: string;
    registerDatetime: string;
    updateDatetime: string;
}