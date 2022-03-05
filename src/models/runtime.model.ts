import { KakaoChatReqModel } from "./kakaochat.model";
import { PluginInfoModel } from "./plugin.model";
import { BasicResponseModel } from "./response.model";

export interface RuntimePayloadModel {
    pluginList: PluginInfoModel[];
    kakaoChatPayload: KakaoChatReqModel[];
    processResult: BasicResponseModel[];
}
