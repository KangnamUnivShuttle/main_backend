import { PluginInfoModel } from "../models/plugin.model";
import { NextBlockModel, RuntimeHashmapModel, RuntimePayloadModel } from "../models/runtime.model";

const kakaoChatRuntimeHashmap: RuntimeHashmapModel = {
    'intro': {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: []
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
            } as NextBlockModel
        ]
    } as RuntimePayloadModel,
    'sample_shuttle_route': {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: []
    } as RuntimePayloadModel,
    'sample_nearest_bus_time': {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: []
    } as RuntimePayloadModel,
    'sample_shuttle_route_station_list': {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: []
    } as RuntimePayloadModel,
    'sample_shuttle_info_selector': {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: []
    } as RuntimePayloadModel
};

const loadRuntimeDB = function(isDev: boolean = false): RuntimeHashmapModel {
    if (isDev) {
        return kakaoChatRuntimeHashmap
    }
    return {} as RuntimeHashmapModel
}

const getBestRuntimeChoice = function(currentInputMsg: string, lastRuntimeKey: string = 'intro', isDev: boolean = false): RuntimePayloadModel | undefined {
    const runtimeDB = loadRuntimeDB(isDev)

    const lastRuntimePayload = runtimeDB[lastRuntimeKey] || runtimeDB['intro']
    const filtered = lastRuntimePayload.nextBlock.filter(block => block.quickReply.messageText === currentInputMsg)
    if (filtered && filtered.length > 0) {
        return runtimeDB[filtered[0].blockID || 'intro']
    }
    return undefined
}

module.exports = {
    getBestRuntimeChoice
}