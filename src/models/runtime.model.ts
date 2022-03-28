import { KakaoChatReqModel, QuickReplyModel } from "./kakaochat.model";
import { PluginInfoModel } from "./plugin.model";
import { BasicResponseModel } from "./response.model";

export interface NextBlockModel {
    blockID: string;
    quickReply: QuickReplyModel;
}

export interface RuntimePayloadModel {
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
    blockLinkedID?: number;
    blockRuntimeID?: number;
    imageID?: number;
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
}