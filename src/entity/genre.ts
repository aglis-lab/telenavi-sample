import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @Column()
    key: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
