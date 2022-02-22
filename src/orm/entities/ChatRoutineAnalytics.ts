import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ChatRoutine } from "./ChatRoutine";

@Index("crid", ["crid"], {})
@Entity("chat_routine_analytics", { schema: "chatbot_system" })
export class ChatRoutineAnalytics {
  @Column("int", {
    primary: true,
    name: "craid",
    comment: "채팅 과정 분석 고유 인덱스",
  })
  craid: number;

  @Column("int", { name: "crid", comment: "채팅 루틴 고유 인덱스" })
  crid: number;

  @Column("longtext", { name: "analytics", comment: "분석 결과" })
  analytics: string;

  @Column("varchar", {
    name: "version",
    comment: "분석 버전",
    length: 10,
    default: () => "'1.0.0'",
  })
  version: string;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @ManyToOne(
    () => ChatRoutine,
    (chatRoutine) => chatRoutine.chatRoutineAnalytics,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr: ChatRoutine;
}
