import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin_user", { schema: "chatbot_system" })
export class AdminUser {
  @PrimaryGeneratedColumn({ type: "int", name: "uid" })
  uid: number;

  @Column("varchar", { name: "email", length: 100 })
  email: string;

  @Column("varchar", { name: "passwd", length: 300 })
  passwd: string;

  @Column("tinyint", { name: "enabled", default: () => "'0'" })
  enabled: number;

  @Column("varchar", {
    name: "memo",
    length: 100,
    default: () => "'undefined'",
  })
  memo: string;

  @Column("tinyint", { name: "deleteable", default: () => "'1'" })
  deleteable: number;

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

  @Column("timestamp", { name: "lastLoginDatetime", nullable: true })
  lastLoginDatetime: Date | null;
}
