import { KakaoChatReqModel, QuickReplyModel } from "./kakaochat.model";
import { PluginInfoModel } from "./plugin.model";
import { BasicResponseModel } from "./response.model";

export interface NextBlockModel {
  blockID: string;
  quickReply: QuickReplyModel;
  link_order_num?: number;
  blockLinkedID?: number;
  is_ml_category: number;
}

export interface RuntimePayloadModel {
  block_order_num?: number;
  pluginList: PluginInfoModel[];
  kakaoChatPayload?: KakaoChatReqModel;
  processResult: BasicResponseModel[];
  nextBlock: NextBlockModel[];
  block_loopable: number;
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
  block_loopable: number;
  is_ml_category: number;
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
  blockRuntimeID?: number;
  blockID: string;
  imageID: number;
  order_num: number;
  container_url: string;
  container_port: string;
  container_env: string;
  x: number;
  y: number;
}

export interface RuntimeBlockModel {
  blockID: string;
  name: string;
  enabled: number;
  order_num: number;
  x: number;
  y: number;
  linkX: number;
  linkY: number;
}

export interface RuntimeBlockLinkModel {
  blockLinkID?: number;
  blockID: string;
  nextBlockID?: string | null;
  messageText?: string;
  action: string;
  label: string;
  webLinkUrl?: string | null;
  enabled: number;
  order_num: number;
}

export interface FallbackStatusModel {
  fallback_id: number;
  userKey: string;
  came_from_block_id: string;
  blockLinkID: number;
  blockID: string;
  enabled: number;
  label: string;
  action: string;
  messageText: string;
  order_num: number;
  webLinkUrl: string;
}
