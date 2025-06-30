import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';

@Entity('stats')
export class Stat {
  @PrimaryColumn({ name: 'stat_name', type: 'text' })
  statName: string;

  @PrimaryColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @PrimaryColumn({ name: 'timestamp', type: 'timestamptz' })
  timestamp: Date;

  @Column('double precision')
  value: number;

  @ManyToOne(() => UserTalusRelation, (relation) => relation.stats, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'talus_id' })
  userTalusRelation: UserTalusRelation;
}
