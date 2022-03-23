import logger from "../logger";
import { QuickReplyModel } from "../models/kakaochat.model";
import { PluginInfoModel } from "../models/plugin.model";
import { NextBlockModel, RuntimeHashmapModel, RuntimePayloadModel } from "../models/runtime.model";

// {
//     "messageText": "홈 으로",
//     "action": "message",
//     "label": "홈"
// },
// {
//     "messageText": "뒤로 가기",
//     "action": "message",
//     "label": "↩"
// }

const kakaoChatRuntimeHashmap: RuntimeHashmapModel = {
    'intro': {
        pluginList: [
            {
                url: 'localhost',
                port: '15001'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'sample_shuttle_info_selector',
                quickReply: {
                    messageText: "달구지 안내를 해줘",
                    action: "message",
                    label: "달구지"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_weather',
                quickReply: {
                    messageText: "경기도 날씨 어때?",
                    action: "message",
                    label: "날씨"
                } as QuickReplyModel
            } as NextBlockModel
        ]
    } as RuntimePayloadModel,
    'sample_weather': {
        pluginList: [
            {
                url: 'localhost',
                port: '15000'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel
        ]
    } as RuntimePayloadModel,
    'sample_shuttle_route_for_nearest_bus_time': {
        pluginList: [
            {
                url: 'localhost',
                port: '15002'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_info_selector',
                quickReply: {
                    messageText: "뒤로 가기",
                    action: "message",
                    label: "↩"
                } as QuickReplyModel
            } as NextBlockModel,
        ]
    } as RuntimePayloadModel,
    'sample_nearest_bus_time': {
        pluginList: [
            {
                url: 'localhost',
                port: '15003'
            } as PluginInfoModel,
            {
                url: 'localhost',
                port: '15004'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_route_for_nearest_bus_time',
                quickReply: {
                    messageText: "뒤로 가기",
                    action: "message",
                    label: "↩"
                } as QuickReplyModel
            } as NextBlockModel,
        ]
    } as RuntimePayloadModel,
    'sample_shuttle_route_for_station_list': {
        pluginList: [
            {
                url: 'localhost',
                port: '15005'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_info_selector',
                quickReply: {
                    messageText: "뒤로 가기",
                    action: "message",
                    label: "↩"
                } as QuickReplyModel
            } as NextBlockModel,
        ]
    } as RuntimePayloadModel,
    'sample_shuttle_route_station_list': {
        pluginList: [
            {
                url: 'localhost',
                port: '15006'
            } as PluginInfoModel,
            {
                url: 'localhost',
                port: '15007'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_route_for_station_list',
                quickReply: {
                    messageText: "뒤로 가기",
                    action: "message",
                    label: "↩"
                } as QuickReplyModel
            } as NextBlockModel,
        ]
    } as RuntimePayloadModel,
    'sample_shuttle_info_selector': {
        pluginList: [
            {
                url: 'localhost',
                port: '15008'
            } as PluginInfoModel
        ],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [
            {
                blockID: 'intro',
                quickReply: {
                    messageText: "홈 으로",
                    action: "message",
                    label: "홈"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_route_for_nearest_bus_time',
                quickReply: {
                    messageText: "가까운 시간의 달구지를 알고 싶어",
                    action: "message",
                    label: "곧 출발할 버스"
                } as QuickReplyModel
            } as NextBlockModel,
            {
                blockID: 'sample_shuttle_route_for_station_list',
                quickReply: {
                    messageText: "달구지 경로를 알고 싶어",
                    action: "message",
                    label: "달구지 경로"
                } as QuickReplyModel
            } as NextBlockModel
        ]
    } as RuntimePayloadModel
};

const loadRuntimeDB = function(isDev: boolean = false): RuntimeHashmapModel {
    if (isDev) {
        logger.warn(`[runtimeLoader] [loadRuntimeDB] Current running on dev mode.`)
        return kakaoChatRuntimeHashmap
    }
    return {} as RuntimeHashmapModel
}

export const getBestRuntimeChoice = function(currentInputMsg: string, lastRuntimeKey: string = 'intro', isDev: boolean = false): string | undefined {
    const runtimeDB = loadRuntimeDB(true) // TODO: should change dev mode to false

    const lastRuntimePayload = runtimeDB[lastRuntimeKey] || runtimeDB['intro']
    // console.log('key', lastRuntimeKey, 'input', currentInputMsg, 'payload', lastRuntimePayload)
    const filtered = lastRuntimePayload.nextBlock.filter(block => block.quickReply.messageText === currentInputMsg)
    if (filtered && filtered.length > 0) {
        return filtered[0].blockID || 'intro'
    }
    return undefined
}

export const getRuntimePayload = function(blockKey: string = 'intro') {
    return kakaoChatRuntimeHashmap[blockKey]
}