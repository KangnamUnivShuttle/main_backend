import { KakaoChatResModel } from "../models/kakaochat.model";

export function returnErrorMessage(message: string = '오류가 발생하였습니다.'): KakaoChatResModel {
    return {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: message
                    }
                }
            ],
            quickReplies: [
                {
                    messageText: "홈으로 이동",
                    action: "message",
                    label: "홈"
                }
            ]
        }
    }
}