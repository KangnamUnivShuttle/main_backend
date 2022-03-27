import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatBlockRuntime } from "./ChatBlockRuntime";

@Entity("chat_image", { schema: "chatbot_system" })
export class ChatImage {
  @PrimaryGeneratedColumn({ type: "int", name: "imageID" })
  imageId: number;

  @Column("varchar", { name: "name", length: 50, default: () => "'Untitled'" })
  name: string;

  @Column("int", { name: "order_num" })
  orderNum: number;

  @Column("varchar", { name: "github_url", length: 500 })
  githubUrl: string;

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
    (chatBlockRuntime) => chatBlockRuntime.image
  )
  chatBlockRuntimes: ChatBlockRuntime[];
}
