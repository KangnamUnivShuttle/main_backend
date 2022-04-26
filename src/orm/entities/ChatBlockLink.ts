import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatFallbackRecommend } from "./ChatFallbackRecommend";
import { ChatBlock } from "./ChatBlock";

@Index("blockID", ["blockId"], {})
@Index("nextBlockID", ["nextBlockId"], {})
@Entity("chat_block_link", { schema: "chatbot_system" })
export class ChatBlockLink {
  @PrimaryGeneratedColumn({ type: "int", name: "blockLinkID" })
  blockLinkId: number;

  @Column("varchar", { name: "blockID", length: 20 })
  blockId: string;

  @Column("varchar", { name: "nextBlockID", nullable: true, length: 20 })
  nextBlockId: string | null;

  @Column("varchar", {
    name: "messageText",
    nullable: true,
    length: 500,
    default: () => "'메시지를 입력하세요.'",
  })
  messageText: string | null;

  @Column("varchar", { name: "action", length: 20, default: () => "'message'" })
  action: string;

  @Column("varchar", { name: "label", length: 50 })
  label: string;

  @Column("varchar", {
    name: "webLinkUrl",
    nullable: true,
    length: 500,
    default: () => "'https://github.com/KangnamUnivShuttle'",
  })
  webLinkUrl: string | null;

  @Column("tinyint", { name: "enabled", default: () => "'1'" })
  enabled: number;

  @Column("int", { name: "order_num", default: () => "'0'" })
  orderNum: number;

  @Column("tinyint", { name: "is_ml_category", default: () => "'1'" })
  isMlCategory: number;

  @Column("timestamp", {
    name: "registerDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @Column("timestamp", {
    name: "updateDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateDatetime: Date;

  @OneToMany(
    () => ChatFallbackRecommend,
    (chatFallbackRecommend) => chatFallbackRecommend.blockLink
  )
  chatFallbackRecommends: ChatFallbackRecommend[];

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatBlockLinks, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "blockID", referencedColumnName: "blockId" }])
  block: ChatBlock;

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatBlockLinks2, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "nextBlockID", referencedColumnName: "blockId" }])
  nextBlock: ChatBlock;
}
