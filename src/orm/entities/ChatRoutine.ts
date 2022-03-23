import { Column, Entity, Index, OneToMany } from "typeorm";
import { ChatRoutineAnalytics } from "./ChatRoutineAnalytics";
import { ChatRoutineItem } from "./ChatRoutineItem";
import { ChatRoutineLog } from "./ChatRoutineLog";
import { ChatTrigger } from "./ChatTrigger";

@Index("ugid", ["ugid"], {})
@Entity("chat_routine", { schema: "chatbot_system" })
export class ChatRoutine {
  @Column("int", {
    primary: true,
    name: "crid",
    comment: "채팅 루틴 고유 인덱스",
  })
  crid: number;

  @Column("int", { name: "ugid", comment: "사용자 그룹 고유 인덱스" })
  ugid: number;

  @Column("varchar", { name: "name", comment: "해당 루틴 이름", length: 50 })
  name: string;

  @Column("varchar", {
    name: "descript",
    nullable: true,
    comment: "설명",
    length: 500,
  })
  descript: string | null;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @Column("timestamp", {
    name: "updateDatetime",
    comment: "업데이트 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateDatetime: Date;

  @OneToMany(
    () => ChatRoutineAnalytics,
    (chatRoutineAnalytics) => chatRoutineAnalytics.cr
  )
  chatRoutineAnalytics: ChatRoutineAnalytics[];

  @OneToMany(() => ChatRoutineItem, (chatRoutineItem) => chatRoutineItem.cr)
  chatRoutineItems: ChatRoutineItem[];

  @OneToMany(() => ChatRoutineLog, (chatRoutineLog) => chatRoutineLog.cr)
  chatRoutineLogs: ChatRoutineLog[];

  @OneToMany(() => ChatRoutineLog, (chatRoutineLog) => chatRoutineLog.cr2)
  chatRoutineLogs2: ChatRoutineLog[];

  @OneToMany(() => ChatRoutineLog, (chatRoutineLog) => chatRoutineLog.cr3)
  chatRoutineLogs3: ChatRoutineLog[];

  @OneToMany(() => ChatTrigger, (chatTrigger) => chatTrigger.cr)
  chatTriggers: ChatTrigger[];
}
