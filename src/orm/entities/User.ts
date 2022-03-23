import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserGroup } from "./UserGroup";

@Index("id", ["id"], { unique: true })
@Index("ugid", ["ugid"], {})
@Entity("user", { schema: "chatbot_system" })
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "uid",
    comment: "사용자 고유 인덱스",
  })
  uid: number;

  @Column("int", { name: "ugid", comment: "사용자 그룹 고유 인덱스" })
  ugid: number;

  @Column("tinyint", {
    name: "isVerified",
    comment: "인증된 사용자 여부",
    width: 1,
    default: () => "'0'",
  })
  isVerified: boolean;

  @Column("varchar", { name: "name", comment: "사용자 이름", length: 50 })
  name: string;

  @Column("varchar", {
    name: "id",
    unique: true,
    comment: "사용자 ID",
    length: 50,
  })
  id: string;

  @Column("varchar", {
    name: "pw",
    comment: "sha512 일방향 암호화 비밀번호",
    length: 512,
  })
  pw: string;

  @Column("timestamp", {
    name: "lastUpdatePW",
    comment: "마지막 비밀번호 변경날짜",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUpdatePw: Date;

  @Column("varchar", {
    name: "phone",
    nullable: true,
    comment: "연락처",
    length: 50,
  })
  phone: string | null;

  @Column("varchar", {
    name: "email",
    nullable: true,
    comment: "이메일 주소",
    length: 50,
  })
  email: string | null;

  @Column("varchar", {
    name: "profileImg",
    nullable: true,
    comment: "사용자 프로필 이미지",
    length: 1000,
  })
  profileImg: string | null;

  @Column("tinyint", {
    name: "isDeleted",
    comment: "사용자 삭제됨 여부 (논리적)",
    width: 1,
    default: () => "'0'",
  })
  isDeleted: boolean;

  @Column("tinyint", {
    name: "immortality",
    comment: "삭제 불가 여부",
    width: 1,
    default: () => "'0'",
  })
  immortality: boolean;

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

  @ManyToOne(() => UserGroup, (userGroup) => userGroup.users, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "ugid", referencedColumnName: "ugid" }])
  ug: UserGroup;
}
