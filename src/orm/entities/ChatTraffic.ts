import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat_traffic", { schema: "chatbot_system" })
export class ChatTraffic {
  @PrimaryGeneratedColumn({ type: "int", name: "ct_id" })
  ctId: number;

  @Column("varchar", { name: "userKey", nullable: true, length: 80 })
  userKey: string | null;

  @Column("varchar", { name: "blockID", nullable: true, length: 20 })
  blockId: string | null;

  @Column("varchar", { name: "msg", nullable: true, length: 500 })
  msg: string | null;

  @Column("timestamp", {
    name: "registerDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;
}
