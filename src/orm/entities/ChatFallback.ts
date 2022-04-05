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
import { ChatUser } from "./ChatUser";
import { ChatBlock } from "./ChatBlock";

@Index("userKey", ["userKey"], {})
@Index("came_from_block_id", ["cameFromBlockId"], {})
@Entity("chat_fallback", { schema: "chatbot_system" })
export class ChatFallback {
  @PrimaryGeneratedColumn({ type: "int", name: "fallback_id" })
  fallbackId: number;

  @Column("varchar", { name: "userKey", nullable: true, length: 80 })
  userKey: string | null;

  @Column("varchar", { name: "came_from_block_id", nullable: true, length: 20 })
  cameFromBlockId: string | null;

  @Column("varchar", { name: "inputMsg", nullable: true, length: 500 })
  inputMsg: string | null;

  @Column("timestamp", {
    name: "registerDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @OneToMany(
    () => ChatFallbackRecommend,
    (chatFallbackRecommend) => chatFallbackRecommend.fallback
  )
  chatFallbackRecommends: ChatFallbackRecommend[];

  @OneToMany(() => ChatUser, (chatUser) => chatUser.fallback)
  chatUsers: ChatUser[];

  @ManyToOne(() => ChatUser, (chatUser) => chatUser.chatFallbacks, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userKey", referencedColumnName: "userkey" }])
  userKey2: ChatUser;

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatFallbacks, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "came_from_block_id", referencedColumnName: "blockId" }])
  cameFromBlock: ChatBlock;
}
