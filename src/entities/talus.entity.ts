import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';

@Entity('talus')
export class Talus {
  @PrimaryGeneratedColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => UserTalusRelation, (relation) => relation.talus)
  userRelations: UserTalusRelation[];
}
