import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ChatRoutine } from "./ChatRoutine";
import { Plugin } from "./Plugin";

@Index("crid", ["crid"], {})
@Index("pid", ["pid"], {})
@Entity("chat_routine_item", { schema: "chatbot_system" })
export class ChatRoutineItem {
  @Column("int", {
    primary: true,
    name: "criid",
    comment: "대화 과정 개별 아이템 고유 인덱스",
  })
  criid: number;

  @Column("int", { name: "crid", comment: "채팅 루틴 고유 인덱스" })
  crid: number;

  @Column("int", { name: "pid", comment: "플러그인 고유 인덱스" })
  pid: number;

  @Column("int", {
    name: "order",
    comment: "대화 과정 처리 순서",
    default: () => "'0'",
  })
  order: number;

  @ManyToOne(() => ChatRoutine, (chatRoutine) => chatRoutine.chatRoutineItems, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr: ChatRoutine;

  @ManyToOne(() => Plugin, (plugin) => plugin.chatRoutineItems, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "pid", referencedColumnName: "pid" }])
  p: Plugin;
}
