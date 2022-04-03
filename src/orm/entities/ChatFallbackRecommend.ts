import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatBlockRuntime } from "./ChatBlockRuntime";
import { ChatFallback } from "./ChatFallback";

@Index("blockRuntimeID", ["blockRuntimeId"], {})
@Index("fallback_id", ["fallbackId"], {})
@Entity("chat_fallback_recommend", { schema: "chatbot_system" })
export class ChatFallbackRecommend {
  @PrimaryGeneratedColumn({ type: "int", name: "fallback_recommend_id" })
  fallbackRecommendId: number;

  @Column("int", { name: "fallback_id" })
  fallbackId: number;

  @Column("int", { name: "blockRuntimeID", nullable: true })
  blockRuntimeId: number | null;

  @ManyToOne(
    () => ChatBlockRuntime,
    (chatBlockRuntime) => chatBlockRuntime.chatFallbackRecommends,
    { onDelete: "SET NULL", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "blockRuntimeID", referencedColumnName: "blockRuntimeId" },
  ])
  blockRuntime: ChatBlockRuntime;

  @ManyToOne(
    () => ChatFallback,
    (chatFallback) => chatFallback.chatFallbackRecommends,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "fallback_id", referencedColumnName: "fallbackId" }])
  fallback: ChatFallback;
}
