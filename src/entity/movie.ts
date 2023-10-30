import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { Genre } from "./genre"

@Entity()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    image_url: string

    @Column()
    director: string

    @Column('text')
    summary: string

    @JoinTable()
    @ManyToMany((type) => Genre, (genre) => genre.movies)
    genres: Genre[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
