import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatBlock } from "./ChatBlock";
import { ChatImage } from "./ChatImage";

@Index("blockID", ["blockId"], {})
@Index("imageID", ["imageId"], {})
@Entity("chat_block_runtime", { schema: "chatbot_system" })
export class ChatBlockRuntime {
  @PrimaryGeneratedColumn({ type: "int", name: "blockRuntimeID" })
  blockRuntimeId: number;

  @Column("varchar", { name: "blockID", length: 20 })
  blockId: string;

  @Column("int", { name: "imageID" })
  imageId: number;

  @Column("int", { name: "order_num" })
  orderNum: number;

  @Column("varchar", {
    name: "container_url",
    length: 100,
    default: () => "'localhost'",
  })
  containerUrl: string;

  @Column("varchar", {
    name: "container_port",
    length: 10,
    default: () => "'15000'",
  })
  containerPort: string;

  @Column("varchar", {
    name: "container_state",
    length: 10,
    default: () => "'Down'",
  })
  containerState: string;

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

  @ManyToOne(() => ChatBlock, (chatBlock) => chatBlock.chatBlockRuntimes, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "blockID", referencedColumnName: "blockId" }])
  block: ChatBlock;

  @ManyToOne(() => ChatImage, (chatImage) => chatImage.chatBlockRuntimes, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "imageID", referencedColumnName: "imageId" }])
  image: ChatImage;
}
