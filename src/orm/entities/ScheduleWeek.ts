import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ScheduleDay } from "./ScheduleDay";
import { Schedule } from "./Schedule";

@Index("sid", ["sid"], {})
@Entity("schedule_week", { schema: "chatbot_system" })
export class ScheduleWeek {
  @PrimaryGeneratedColumn({ type: "int", name: "swid" })
  swid: number;

  @Column("int", { name: "sid" })
  sid: number;

  @Column("int", { name: "dayofweek" })
  dayofweek: number;

  @OneToMany(() => ScheduleDay, (scheduleDay) => scheduleDay.sw)
  scheduleDays: ScheduleDay[];

  @ManyToOne(() => Schedule, (schedule) => schedule.scheduleWeeks, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "sid", referencedColumnName: "sid" }])
  s: Schedule;
}
