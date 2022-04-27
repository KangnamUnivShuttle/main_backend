import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ScheduleWeek } from "./ScheduleWeek";

@Index("swid", ["swid"], {})
@Entity("schedule_day", { schema: "chatbot_system" })
export class ScheduleDay {
  @PrimaryGeneratedColumn({ type: "int", name: "sdid" })
  sdid: number;

  @Column("int", { name: "swid" })
  swid: number;

  @Column("time", { name: "startTime", default: () => "CURRENT_TIMESTAMP" })
  startTime: string;

  @Column("time", { name: "endTime", default: () => "CURRENT_TIMESTAMP" })
  endTime: string;

  @ManyToOne(() => ScheduleWeek, (scheduleWeek) => scheduleWeek.scheduleDays, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "swid", referencedColumnName: "swid" }])
  sw: ScheduleWeek;
}
