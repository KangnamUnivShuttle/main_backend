import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ChatRoutine } from "./ChatRoutine";

@Index("crid", ["crid"], {})
@Entity("chat_trigger", { schema: "chatbot_system" })
export class ChatTrigger {
  @Column("int", {
    primary: true,
    name: "ctid",
    comment: "대화 트리거 고유 인덱스",
  })
  ctid: number;

  @Column("int", { name: "crid", comment: "채팅 루틴 고유 인덱스" })
  crid: number;

  @Column("varchar", {
    name: "input",
    comment: "사용자 입력 내용",
    length: 1000,
  })
  input: string;

  @ManyToOne(() => ChatRoutine, (chatRoutine) => chatRoutine.chatTriggers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr: ChatRoutine;
}
