import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatFallback } from "./ChatFallback";
import { ChatBlockLink } from "./ChatBlockLink";

@Index("fallback_id", ["fallbackId"], {})
@Index("blockLinkID", ["blockLinkId"], {})
@Entity("chat_fallback_recommend", { schema: "chatbot_system" })
export class ChatFallbackRecommend {
  @PrimaryGeneratedColumn({ type: "int", name: "fallback_recommend_id" })
  fallbackRecommendId: number;

  @Column("int", { name: "fallback_id" })
  fallbackId: number;

  @Column("int", { name: "blockLinkID", nullable: true })
  blockLinkId: number | null;

  @ManyToOne(
    () => ChatFallback,
    (chatFallback) => chatFallback.chatFallbackRecommends,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "fallback_id", referencedColumnName: "fallbackId" }])
  fallback: ChatFallback;

  @ManyToOne(
    () => ChatBlockLink,
    (chatBlockLink) => chatBlockLink.chatFallbackRecommends,
    { onDelete: "SET NULL", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "blockLinkID", referencedColumnName: "blockLinkId" }])
  blockLink: ChatBlockLink;
}
