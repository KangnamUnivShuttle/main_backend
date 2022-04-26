import logger from "../logger";
import { QuickReplyModel } from "../models/kakaochat.model";
import { PluginInfoModel } from "../models/plugin.model";
import {
  FallbackStatusModel,
  NextBlockModel,
  RuntimeDBModel,
  RuntimeHashmapModel,
  RuntimePayloadModel,
} from "../models/runtime.model";
import { getConnection, getManager } from "typeorm";
import {
  BLOCK_ID_FALLBACK,
  FALLBACK_RECOMMEND_SIZE,
} from "../types/global.types";
import { ChatUser } from "../orm/entities/ChatUser";
import { ChatFallback } from "../orm/entities/ChatFallback";
import { ChatFallbackRecommend } from "../orm/entities/ChatFallbackRecommend";
import { ChatBlockLink } from "../orm/entities/ChatBlockLink";
import { ChatBlock } from "../orm/entities/ChatBlock";

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
  intro: {
    pluginList: [
      {
        url: "plugin_simple_toss_intro",
        port: "15000",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "sample_shuttle_info_selector",
        quickReply: {
          messageText: "달구지 안내를 해줘",
          action: "message",
          label: "달구지",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_weather",
        quickReply: {
          messageText: "경기도 날씨 어때?",
          action: "message",
          label: "날씨",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_weather: {
    pluginList: [
      {
        url: "plugin_weather_1",
        port: "15000",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_shuttle_route_for_nearest_bus_time: {
    pluginList: [
      {
        url: "localhost",
        port: "15002",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_info_selector",
        quickReply: {
          messageText: "뒤로 가기",
          action: "message",
          label: "↩",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_nearest_bus_time: {
    pluginList: [
      {
        url: "localhost",
        port: "15003",
      } as PluginInfoModel,
      {
        url: "localhost",
        port: "15004",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_route_for_nearest_bus_time",
        quickReply: {
          messageText: "뒤로 가기",
          action: "message",
          label: "↩",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_shuttle_route_for_station_list: {
    pluginList: [
      {
        url: "localhost",
        port: "15005",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_info_selector",
        quickReply: {
          messageText: "뒤로 가기",
          action: "message",
          label: "↩",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_shuttle_route_station_list: {
    pluginList: [
      {
        url: "localhost",
        port: "15006",
      } as PluginInfoModel,
      {
        url: "localhost",
        port: "15007",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_route_for_station_list",
        quickReply: {
          messageText: "뒤로 가기",
          action: "message",
          label: "↩",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
  sample_shuttle_info_selector: {
    pluginList: [
      {
        url: "plugin_simple_toss_shuttle_selector",
        port: "15000",
      } as PluginInfoModel,
    ],
    kakaoChatPayload: undefined,
    processResult: [],
    nextBlock: [
      {
        blockID: "intro",
        quickReply: {
          messageText: "홈 으로",
          action: "message",
          label: "홈",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_route_for_nearest_bus_time",
        quickReply: {
          messageText: "가까운 시간의 달구지를 알고 싶어",
          action: "message",
          label: "곧 출발할 버스",
        } as QuickReplyModel,
      } as NextBlockModel,
      {
        blockID: "sample_shuttle_route_for_station_list",
        quickReply: {
          messageText: "달구지 경로를 알고 싶어",
          action: "message",
          label: "달구지 경로",
        } as QuickReplyModel,
      } as NextBlockModel,
    ],
    block_loopable: 0,
  } as RuntimePayloadModel,
};

const runtimeDBModelConverter = function (
  runtimeList: RuntimeDBModel[]
): RuntimeHashmapModel {
  const result = {} as RuntimeHashmapModel;
  runtimeList.forEach((runtime) => {
    // logger.debug(`runtime check, ${JSON.stringify(runtime)}, ${Object.keys(runtime)}`)
    // logger.debug(`block id ${runtime.blockID}`)
    // logger.debug(`block linked: ${runtime.blockLinkID} / ${runtime.blockLinkID}, asdf ${runtime['blockLinkID']}`)
    // logger.debug(`image id: ${!runtime.imageID} / ${runtime.imageID}`)
    // logger.debug(`runtime id: ${!runtime.blockRuntimeID} / ${runtime.blockRuntimeID}`)
    if (
      runtime.blockID &&
      !runtime.blockLinkID &&
      !runtime.blockRuntimeID &&
      !runtime.imageID
    ) {
      result[runtime.blockID] = {
        pluginList: [],
        kakaoChatPayload: undefined,
        processResult: [],
        nextBlock: [],
        block_order_num: runtime.block_order_num,
        block_loopable: runtime.block_loopable,
      } as RuntimePayloadModel;
    } else if (runtime.blockLinkID) {
      result[runtime.blockID].nextBlock.push({
        blockID: runtime.nextBlockID,
        link_order_num: runtime.link_order_num,
        blockLinkedID: runtime.blockLinkID,
        quickReply: {
          messageText: runtime.messageText,
          action: runtime.action,
          label: runtime.label,
          webLinkUrl: runtime.webLinkUrl,
        } as QuickReplyModel,
        is_ml_category: runtime.is_ml_category,
      } as NextBlockModel);
    } else if (runtime.blockRuntimeID) {
      result[runtime.blockID].pluginList.push({
        url: runtime.container_url,
        port: runtime.container_port,
        runtime_order_num: runtime.runtime_order_num,
        runtimeID: runtime.blockRuntimeID,
      } as PluginInfoModel);
    }
  });

  const len = Object.keys(result).length;

  logger.debug(`[runtimeLoader] [runtimeDBModelConverter] hashmap len: ${len}`);

  if (len <= 0) {
    logger.warn(
      `[runtimeLoader] [runtimeDBModelConverter] empty hashmap detected`
    );
  }

  return result;
};

const loadRuntimeDB = async function (
  isDev: boolean = false
): Promise<RuntimeHashmapModel> {
  if (isDev) {
    logger.warn(`[runtimeLoader] [loadRuntimeDB] Current running on dev mode.`);
    return Promise.resolve(kakaoChatRuntimeHashmap);
  }
  const entityManager = getManager();
  const runtimeList = (await entityManager.query(`
        SELECT * FROM chat_block_runtime_map
    `)) as RuntimeDBModel[];

  // logger.debug(`[runtimeLoader] [loadRuntimeDB] total runtime list: ${JSON.stringify(runtimeList)}`)

  return Promise.resolve(runtimeDBModelConverter(runtimeList));
};

export const getBestRuntimeChoice = async function (
  currentInputMsg: string,
  lastRuntimeKey: string = "intro",
  isDev: boolean = false
): Promise<string | undefined> {
  const runtimeDB = await loadRuntimeDB(isDev); // TODO: should change dev mode to false

  logger.debug(
    `[runtimeLoader] [getBestRuntimeChoice] total runtime list: ${JSON.stringify(
      runtimeDB
    )}`
  );

  const lastRuntimePayload = lastRuntimeKey
    ? runtimeDB[lastRuntimeKey]
    : runtimeDB["intro"];
  // console.log('key', lastRuntimeKey, 'input', currentInputMsg, 'payload', lastRuntimePayload)
  const filtered = lastRuntimePayload.nextBlock.filter(
    (block) => block.quickReply.messageText === currentInputMsg
  );
  if (filtered && filtered.length > 0) {
    if (!filtered[0].blockID) {
      logger.warn(
        `[runtimeLoader] [getBestRuntimeChoice] ${lastRuntimeKey} -> ${currentInputMsg} : id is null`
      );
    }
    if (filtered.length > 1) {
      logger.warn(
        `[runtimeLoader] [getBestRuntimeChoice] First ordered block selected automatically ${filtered[0].blockID}`
      );
    }
    return Promise.resolve(filtered[0].blockID || "intro");
  }
  return Promise.resolve(undefined);
};

export const getFallbackRuntimePayload = async function (
  userKey: string,
  messageText: string
): Promise<string | undefined> {
  const entityManager = getManager();
  const fallbackStatus = (await entityManager.query(`
        SELECT * FROM chat_fallback_status WHERE userKey = '${userKey}' AND messageText = '${messageText}'
    `)) as FallbackStatusModel[];
  if (fallbackStatus && fallbackStatus.length > 0) {
    return fallbackStatus[0].blockID;
  }
  return undefined;
};

export const getRuntimePayload = async function (
  blockKey: string = "intro",
  isDev: boolean = false
) {
  return (await loadRuntimeDB(isDev))[blockKey];
};

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export const getRecommendedReplyList = async function (
  isDev: boolean = false
): Promise<NextBlockModel[]> {
  const totalNextBlockList: NextBlockModel[] = [];
  const randomRecommendNextBlockList: NextBlockModel[] = [];

  const runtimeDB = await loadRuntimeDB(isDev);

  Object.keys(runtimeDB).forEach((key) => {
    runtimeDB[key].nextBlock
      .filter((nBlock) => nBlock.is_ml_category === 1)
      .forEach((next) => {
        totalNextBlockList.push({
          ...next,
          blockID: key,
        } as NextBlockModel);
      });
  });

  logger.info(
    `[runtimeLoader] [getRecommendedReplyList] current total next block list len: ${totalNextBlockList.length}`
  );

  if (totalNextBlockList.length < FALLBACK_RECOMMEND_SIZE) {
    logger.warn(
      `[runtimeLoader] [getRecommendedReplyList] total next block len is less than fallback recommend size, ${totalNextBlockList.length} < ${FALLBACK_RECOMMEND_SIZE}`
    );
    return Promise.resolve(randomRecommendNextBlockList);
  }

  let cnt = 1;

  while (cnt <= FALLBACK_RECOMMEND_SIZE) {
    randomRecommendNextBlockList.push(
      totalNextBlockList.splice(
        getRandomInt(0, totalNextBlockList.length),
        1
      )[0]
    );
    cnt++;
  }

  logger.info(
    `[runtimeLoader] [getRecommendedReplyList] random recommend ready.`
  );

  return Promise.resolve(randomRecommendNextBlockList);
};
