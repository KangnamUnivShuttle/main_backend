import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat_traffic", { schema: "chatbot_system" })
export class ChatTraffic {
  @PrimaryGeneratedColumn({ type: "int", name: "ct_id" })
  ctId: number;

  @Column("varchar", { name: "userKey", length: 80 })
  userKey: string;

  @Column("varchar", { name: "blockID", length: 20 })
  blockId: string;

  @Column("varchar", { name: "msg", length: 500 })
  msg: string;

  @Column("timestamp", {
    name: "registerDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;
}
