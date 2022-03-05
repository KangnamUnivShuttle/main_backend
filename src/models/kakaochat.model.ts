export interface KakaoChatReqModel {
    intent: BlockOrIntentOrBot;
    userRequest: UserRequest;
    contexts?: (null)[] | null;
    bot: BlockOrIntentOrBot;
    action: Action;
}
export interface BlockOrIntentOrBot {
    id: string;
    name: string;
}
export interface UserRequest {
    timezone: string;
    params: Params;
    block: BlockOrIntentOrBot;
    utterance: string;
    lang: string;
    user: User;
}
export interface Params {
    exampleParam: string;
}
export interface User {
    id: string;
    type: string;
    properties: Properties;
}
export interface Properties {
    appUserId: string;
    appUserStatus: string;
    plusfriend_user_key: string;
}
export interface Action {
    name: string;
    clientExtra: string;
    params: ParamsOrDetailParams;
    id: string;
    detailParams: ParamsOrDetailParams;
}
export interface ParamsOrDetailParams {
}
