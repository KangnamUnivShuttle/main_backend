import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_env", { schema: "chatbot_system" })
export class SystemEnv {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "seid",
    comment: "시스템 변수 고유 인덱스",
  })
  seid: number;

  @Column("varchar", { name: "key", comment: "시스템 변수 키", length: 50 })
  key: string;

  @Column("varchar", { name: "val", comment: "시스템 변수 값", length: 1000 })
  val: string;
}
