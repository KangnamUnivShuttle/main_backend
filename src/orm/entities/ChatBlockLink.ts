import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @Column("varchar", { name: "messageText", length: 500 })
  messageText: string;

  @Column("varchar", { name: "action", length: 20, default: () => "'message'" })
  action: string;

  @Column("varchar", { name: "label", length: 20 })
  label: string;

  @Column("varchar", { name: "webLinkUrl", length: 500 })
  webLinkUrl: string;

  @Column("tinyint", { name: "enabled", default: () => "'1'" })
  enabled: number;

  @Column("int", { name: "order_num" })
  orderNum: number;

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
