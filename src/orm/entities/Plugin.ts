import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ChatRoutineItem } from "./ChatRoutineItem";
import { SystemResource } from "./SystemResource";

@Index("ugid", ["ugid"], {})
@Index("srid", ["srid"], {})
@Entity("plugin", { schema: "chatbot_system" })
export class Plugin {
  @Column("int", {
    primary: true,
    name: "pid",
    comment: "플러그인 고유 인덱스",
  })
  pid: number;

  @Column("int", { name: "ugid", comment: "사용자 그룹 고유 인덱스" })
  ugid: number;

  @Column("int", { name: "srid", comment: "시스템 자원 프리셋 고유 인덱스" })
  srid: number;

  @Column("varchar", { name: "descript", comment: "설명", length: 100 })
  descript: string;

  @Column("varchar", { name: "name", comment: "플러그인 이름", length: 100 })
  name: string;

  @Column("int", {
    name: "port",
    comment: "해당 플러그인이 사용될 내부포트 번호",
    default: () => "'10000'",
  })
  port: number;

  @Column("varchar", {
    name: "url",
    comment: "해당 플러그인 clone 할 repo 주소",
    length: 500,
  })
  url: string;

  @Column("text", {
    name: "env",
    nullable: true,
    comment: "해당 플러그인에 사용될 env내용",
  })
  env: string | null;

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

  @OneToMany(() => ChatRoutineItem, (chatRoutineItem) => chatRoutineItem.p)
  chatRoutineItems: ChatRoutineItem[];

  @ManyToOne(() => SystemResource, (systemResource) => systemResource.plugins, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "srid", referencedColumnName: "srid" }])
  sr: SystemResource;
}
