import { Column, Entity, OneToMany } from "typeorm";
import { Plugin } from "./Plugin";

@Entity("system_resource", { schema: "chatbot_system" })
export class SystemResource {
  @Column("int", {
    primary: true,
    name: "srid",
    comment: "시스템 자원 프리셋 고유 인덱스",
  })
  srid: number;

  @Column("varchar", { name: "name", comment: "해당 자원 이름", length: 50 })
  name: string;

  @Column("varchar", {
    name: "cpu",
    comment: "cpu 점유량",
    length: 10,
    default: () => "'0.5'",
  })
  cpu: string;

  @Column("varchar", {
    name: "ram",
    comment: "ram 점유량",
    length: 10,
    default: () => "'128M'",
  })
  ram: string;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @OneToMany(() => Plugin, (plugin) => plugin.sr)
  plugins: Plugin[];
}
