import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, ManyToMany } from "typeorm"
import { Movie } from "./movie"

@Entity()
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @Column()
    key: string

    @ManyToMany(() => Movie, (movie) => movie.genres)
    movies: Movie[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
