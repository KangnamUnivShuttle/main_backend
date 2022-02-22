import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserGroup } from "./UserGroup";

@Entity("role", { schema: "chatbot_system" })
export class Role {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "rid",
    comment: "권한 고유 인덱스",
  })
  rid: number;

  @Column("varchar", { name: "name", comment: "권한 이름", length: 50 })
  name: string;

  @Column("int", {
    name: "level",
    comment: "권한 레벨, 0: 슈퍼유저",
    default: () => "'100'",
  })
  level: number;

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

  @OneToMany(() => UserGroup, (userGroup) => userGroup.r)
  userGroups: UserGroup[];
}
