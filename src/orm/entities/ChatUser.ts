import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ChatLog } from "./ChatLog";
import { ChatFallback } from "./ChatFallback";

@Index("fallback_id", ["fallbackId"], {})
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

  @Column("int", { name: "fallback_id", nullable: true })
  fallbackId: number | null;

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

  @OneToMany(() => ChatLog, (chatLog) => chatLog.userKey2)
  chatLogs: ChatLog[];

  @ManyToOne(() => ChatFallback, (chatFallback) => chatFallback.chatUsers, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "fallback_id", referencedColumnName: "fallbackId" }])
  fallback: ChatFallback;

  @OneToMany(() => ChatFallback, (chatFallback) => chatFallback.userKey2)
  chatFallbacks: ChatFallback[];
}
