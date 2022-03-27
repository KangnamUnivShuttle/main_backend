import logger from "../logger";
import { QuickReplyModel } from "../models/kakaochat.model";
import { PluginInfoModel } from "../models/plugin.model";
import { NextBlockModel, RuntimeDBModel, RuntimeHashmapModel, RuntimePayloadModel } from "../models/runtime.model";
import { getManager } from 'typeorm';

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
                url: 'plugin_simple_toss_intro',
                port: '15000'
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
                url: 'plugin_weather_1',
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
                url: 'plugin_simple_toss_shuttle_selector',
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

const runtimeDBModelConverter = function(runtimeList: RuntimeDBModel[]): RuntimeHashmapModel {
    const result = {} as RuntimeHashmapModel;
    runtimeList.forEach(runtime => {
        if (runtime.blockID && !runtime.blockLinkedID && !runtime.blockRuntimeID && !runtime.imageID) {
            result[runtime.blockID] = {
                pluginList: [],
                kakaoChatPayload: undefined,
                processResult: [],
                nextBlock: []
            } as RuntimePayloadModel;
        } else if (runtime.blockLinkedID) {
            result[runtime.blockID].nextBlock.push(
                {
                    blockID: runtime.nextBlockID,
                    quickReply: {
                        messageText: runtime.messageText,
                        action: runtime.action,
                        label: runtime.label,
                        webLinkUrl: runtime.webLinkUrl
                    } as QuickReplyModel
                } as NextBlockModel
            )
        } else if (runtime.blockRuntimeID) {
            result[runtime.blockID].pluginList.push(
                {
                    url: runtime.container_url,
                    port: runtime.container_port
                } as PluginInfoModel
            )
        }
    })

    const len = Object.keys(result).length

    logger.debug(`[runtimeLoader] [runtimeDBModelConverter] hashmap len: ${len}`)

    if (len <= 0) {
        logger.warn(`[runtimeLoader] [runtimeDBModelConverter] empty hashmap detected`)
    }

    return result
}

const loadRuntimeDB = async function(isDev: boolean = false): Promise<RuntimeHashmapModel> {
    if (isDev) {
        logger.warn(`[runtimeLoader] [loadRuntimeDB] Current running on dev mode.`)
        return Promise.resolve(kakaoChatRuntimeHashmap);
    }
    const entityManager = getManager();
    const runtimeList = (await entityManager.query(`
        SELECT * FROM chat_block_runtime_map
    `)) as RuntimeDBModel[];

    return Promise.resolve(runtimeDBModelConverter(runtimeList))
}

export const getBestRuntimeChoice = async function(currentInputMsg: string, lastRuntimeKey: string = 'intro', isDev: boolean = false): Promise<string | undefined> {
    const runtimeDB = await loadRuntimeDB(isDev) // TODO: should change dev mode to false

    const lastRuntimePayload = runtimeDB[lastRuntimeKey] || runtimeDB['intro']
    // console.log('key', lastRuntimeKey, 'input', currentInputMsg, 'payload', lastRuntimePayload)
    const filtered = lastRuntimePayload.nextBlock.filter(block => block.quickReply.messageText === currentInputMsg)
    if (filtered && filtered.length > 0) {
        return Promise.resolve(filtered[0].blockID || 'intro')
    }
    return Promise.resolve(undefined)
}

export const getRuntimePayload = async function(blockKey: string = 'intro', isDev: boolean = false) {
    return (await loadRuntimeDB(isDev))[blockKey]
}