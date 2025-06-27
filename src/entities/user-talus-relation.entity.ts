import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { User } from './user.entity';
import { Talus } from './talus.entity';
import { Stat } from './stat.entity';

@Entity('user_talus_relation')
export class UserTalusRelation {
  @PrimaryColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @ManyToOne(() => Talus, (talus) => talus.userRelations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'talus_id' })
  talus: Talus;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.talusRelations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'pairing_date', type: 'timestamptz' })
  pairingDate: Date;

  @OneToMany(() => Stat, (stat) => stat.userTalusRelation)
  stats: Stat[];
}
