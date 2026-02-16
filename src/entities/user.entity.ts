import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name', type: 'text' })
  firstName: string;

  @Column({ name: 'last_name', type: 'text' })
  lastName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'double precision' })
  height: number;

  @Column({ type: 'double precision' })
  weight: number;

  @Column({ type: 'text' })
  gender: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => UserTalusRelation, (relation) => relation.user)
  talusRelations: UserTalusRelation[];
}
