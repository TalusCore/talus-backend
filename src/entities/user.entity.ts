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

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ name: 'account_creation', type: 'timestamptz' })
  accountCreation: Date;

  @OneToMany(() => UserTalusRelation, (relation) => relation.user)
  talusRelations: UserTalusRelation[];
}
