import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Index("rid", ["rid"], {})
@Entity("user_group", { schema: "chatbot_system" })
export class UserGroup {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "ugid",
    comment: "사용자 그룹 고유 인덱스",
  })
  ugid: number;

  @Column("int", { name: "rid", comment: "권한 고유 인덱스" })
  rid: number;

  @Column("varchar", { name: "name", comment: "그룹 이름", length: 50 })
  name: string;

  @Column("tinyint", {
    name: "immortality",
    comment: "삭제 가능 여부",
    width: 1,
    default: () => "'0'",
  })
  immortality: boolean;

  @Column("timestamp", {
    name: "registerDatetime",
    comment: "등록날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  registerDatetime: Date;

  @Column("timestamp", {
    name: "updateDatetime",
    comment: "업데이트 날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateDatetime: Date;

  @OneToMany(() => User, (user) => user.ug)
  users: User[];

  @ManyToOne(() => Role, (role) => role.userGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "rid", referencedColumnName: "rid" }])
  r: Role;
}
