import { Column, Entity, OneToMany } from "typeorm";
import { ChatBlockRuntime } from "./ChatBlockRuntime";
import { ChatBlockLink } from "./ChatBlockLink";

@Entity("chat_block", { schema: "chatbot_system" })
export class ChatBlock {
  @Column("varchar", { primary: true, name: "blockID", length: 20 })
  blockId: string;

  @Column("varchar", { name: "name", length: 50, default: () => "'Untitled'" })
  name: string;

  @Column("tinyint", { name: "enabled", default: () => "'1'" })
  enabled: number;

  @Column("int", { name: "order_num", default: () => "'0'" })
  orderNum: number;

  @Column("tinyint", { name: "deleteable", default: () => "'1'" })
  deleteable: number;

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
    () => ChatBlockRuntime,
    (chatBlockRuntime) => chatBlockRuntime.block
  )
  chatBlockRuntimes: ChatBlockRuntime[];

  @OneToMany(() => ChatBlockLink, (chatBlockLink) => chatBlockLink.block)
  chatBlockLinks: ChatBlockLink[];

  @OneToMany(() => ChatBlockLink, (chatBlockLink) => chatBlockLink.nextBlock)
  chatBlockLinks2: ChatBlockLink[];
}