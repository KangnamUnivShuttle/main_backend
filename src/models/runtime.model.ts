import { KakaoChatReqModel, QuickReplyModel } from "./kakaochat.model";
import { PluginInfoModel } from "./plugin.model";
import { BasicResponseModel } from "./response.model";

export interface NextBlockModel {
    blockID: string;
    quickReply: QuickReplyModel;
    link_order_num?: number;
    blockLinkedID?: number;
}

export interface RuntimePayloadModel {
    block_order_num?: number;
    pluginList: PluginInfoModel[];
    kakaoChatPayload?: KakaoChatReqModel;
    processResult: BasicResponseModel[];
    nextBlock: NextBlockModel[];
}

export interface RuntimeHashmapModel {
    [key: string]: RuntimePayloadModel;
}

export interface RuntimeDBModel {
    blockID: string;
    block_order_num?: number;
    blockLinkID?: number;
    link_order_num?: number;
    blockRuntimeID?: number;
    imageID?: number;
    runtime_order_num?: number;
    messageText?: string;
    nextBlockID?: string;
    action?: string;
    label?: string;
    webLinkUrl?: string;
    container_url?: string;
    container_port?: string;
}

export interface RuntimeControlModel {
    blockRuntimeID: number;
    container_name: string;
    container_state: string;
    image_url: string;
    cpu: string;
    ram: string;
    path: string;
    env?: string[];
}

export interface RuntimeModel {
    blockRuntimeID: number;
    blockID: string;
    imageID: number;
    order_num: number;
    container_url: string;
    container_port: string;
    container_env: string;
}

export interface RuntimeBlockModel {
    blockID: string;
    name: string;
    enabled: number;
    order_num: number;
}

export interface RuntimeBlockLinkModel {
    blockLinkID?: number;
    blockID: string;
    nextBlockID?: string;
    messageText?: string;
    action: string;
    label: string;
    webLinkUrl?: string;
    enabled: number;
    order_num: number;
}