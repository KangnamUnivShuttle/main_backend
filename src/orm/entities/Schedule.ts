import { Column, Entity, Index } from "typeorm";

@Index("ugid", ["ugid"], {})
@Entity("schedule", { schema: "chatbot_system" })
export class Schedule {
  @Column("int", { primary: true, name: "sid", comment: "스케쥴 고유 인덱스" })
  sid: number;

  @Column("int", { name: "ugid", comment: "사용자 그룹 고유 인덱스" })
  ugid: number;

  @Column("varchar", { name: "name", comment: "스케쥴 이름", length: 50 })
  name: string;

  @Column("int", {
    name: "days_of_the_week",
    comment: "활성 요일",
    default: () => "'0'",
  })
  daysOfTheWeek: number;

  @Column("time", { name: "start_time", nullable: true, comment: "시작 시간" })
  startTime: string | null;

  @Column("time", { name: "end_time", nullable: true, comment: "마감 시간" })
  endTime: string | null;

  @Column("date", { name: "start_date", nullable: true, comment: "시작 날짜" })
  startDate: string | null;

  @Column("date", { name: "end_date", nullable: true, comment: "마감 날짜" })
  endDate: string | null;

  @Column("text", { name: "descript", nullable: true, comment: "내용" })
  descript: string | null;
}
