import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ScheduleWeek } from "./ScheduleWeek";

@Entity("schedule", { schema: "chatbot_system" })
export class Schedule {
  @PrimaryGeneratedColumn({ type: "int", name: "sid" })
  sid: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("tinyint", { name: "enabled", default: () => "'1'" })
  enabled: number;

  @Column("date", { name: "startDatetime", default: () => "CURRENT_TIMESTAMP" })
  startDatetime: string;

  @Column("date", {
    name: "endDatetime",
    nullable: true,
    comment: "https://dev.mysql.com/doc/refman/8.0/en/datetime.html",
    default: () => "'2038-01-19'",
  })
  endDatetime: string | null;

  @Column("tinyint", {
    name: "repeat",
    comment: "0: none\r\n1: every year\r\n2: every month",
    default: () => "'0'",
  })
  repeat: number;

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

  @OneToMany(() => ScheduleWeek, (scheduleWeek) => scheduleWeek.s)
  scheduleWeeks: ScheduleWeek[];
}
