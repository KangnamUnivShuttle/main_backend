import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatBlock } from "./ChatBlock";
import { ChatUser } from "./ChatUser";

@Index("last_block_id", ["lastBlockId"], {})
@Index("selected_recommended_block_id", ["selectedRecommendedBlockId"], {})
@Index("userKey", ["userKey"], {})
@Entity("chat_log", { schema: "chatbot_system" })
export class ChatLog {
  @PrimaryGeneratedColumn({ type: "int", name: "chatLogID" })
  chatLogId: number;

  @Column("varchar", { name: "userKey", nullable: true, length: 80 })
  userKey: string | null;

  @Column("varchar", { name: "last_block_id", nullable: true, length: 20 })
  lastBlockId: string | null;

  @Column("varchar", {
    name: "selected_recommended_block_id",
    nullable: true,
    length: 20,
  })
  selectedRecommendedBlockId: string | null;

  @Column("varchar", { name: "msg", length: 500 })
  msg: string;

  @Column("timestamp", {
    name: "registerDatetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatLogs, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "last_block_id", referencedColumnName: "blockId" }])
  lastBlock: ChatBlock;

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatLogs2, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "selected_recommended_block_id", referencedColumnName: "blockId" },
  ])
  selectedRecommendedBlock: ChatBlock;

  @ManyToOne(() => ChatUser, (chatUser) => chatUser.chatLogs, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userKey", referencedColumnName: "userkey" }])
  userKey2: ChatUser;
}
