import { Column, Entity } from "typeorm";

@Entity("sys_log", { schema: "chatbot_system" })
export class SysLog {
  @Column("int", { primary: true, name: "slid", comment: "로그 고유 인덱스" })
  slid: number;

  @Column("varchar", {
    name: "level",
    comment: "로그 레벨",
    length: 10,
    default: () => "'verbose'",
  })
  level: string;

  @Column("varchar", {
    name: "from",
    comment: "로그 주체자",
    length: 10,
    default: () => "'unknown'",
  })
  from: string;

  @Column("varchar", {
    name: "category",
    comment: "로그 필터링 옵션",
    length: 10,
  })
  category: string;

  @Column("varchar", { name: "feature", comment: "로그 발생 기능", length: 10 })
  feature: string;

  @Column("text", { name: "descript", comment: "내용" })
  descript: string;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;
}
