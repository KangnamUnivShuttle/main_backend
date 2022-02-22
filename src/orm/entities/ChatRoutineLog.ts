import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ChatRoutine } from "./ChatRoutine";

@Index("crid", ["crid"], {})
@Entity("chat_routine_log", { schema: "chatbot_system" })
export class ChatRoutineLog {
  @Column("int", {
    primary: true,
    name: "crlid",
    comment: "대화 과정 분석 고유 인덱스",
  })
  crlid: number;

  @Column("int", { name: "crid", comment: "채팅 루틴 고유 인덱스" })
  crid: number;

  @Column("varchar", {
    name: "user_key",
    comment: "카카오톡 유저 코드",
    length: 50,
  })
  userKey: string;

  @Column("varchar", {
    name: "triggered_by",
    comment: "사용자 입력 내용",
    length: 1000,
  })
  triggeredBy: string;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @ManyToOne(() => ChatRoutine, (chatRoutine) => chatRoutine.chatRoutineLogs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr: ChatRoutine;

  @ManyToOne(() => ChatRoutine, (chatRoutine) => chatRoutine.chatRoutineLogs2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr2: ChatRoutine;

  @ManyToOne(() => ChatRoutine, (chatRoutine) => chatRoutine.chatRoutineLogs3, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "crid", referencedColumnName: "crid" }])
  cr3: ChatRoutine;
}
