import { Column, Entity } from "typeorm";

@Entity("chat_user", { schema: "chatbot_system" })
export class ChatUser {
  @Column("varchar", { primary: true, name: "userkey", length: 80 })
  userkey: string;

  @Column("varchar", {
    name: "current_block_id",
    length: 50,
    default: () => "'intro'",
  })
  currentBlockId: string;

  @Column("varchar", {
    name: "last_block_id",
    length: 50,
    default: () => "'intro'",
  })
  lastBlockId: string;

  @Column("varchar", { name: "last_input_msg", nullable: true, length: 500 })
  lastInputMsg: string | null;

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
}
