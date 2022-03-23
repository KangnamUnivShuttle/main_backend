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