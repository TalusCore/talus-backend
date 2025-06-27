import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('stats')
export class Stat {
  @ApiProperty({
    description: 'Name of the statistic',
    example: 'heart rate'
  })
  @PrimaryColumn({ name: 'stat_name', type: 'text' })
  statName: string;

  @ApiProperty({
    description: 'UUID of the Talus related to this stat',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @PrimaryColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @ApiProperty({
    description: 'Timestamp when the stat was recorded',
    example: '2023-06-25T14:30:00Z'
  })
  @PrimaryColumn({ name: 'timestamp', type: 'timestamptz' })
  timestamp: Date;

  @ApiProperty({
    description: 'Value of the statistic',
    example: 42.5
  })
  @Column('double precision')
  value: number;

  @ApiProperty({
    type: () => UserTalusRelation,
    description: 'Relation to UserTalusRelation entity'
  })
  @ManyToOne(() => UserTalusRelation, (relation) => relation.stats, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'talus_id' })
  userTalusRelation: UserTalusRelation;
}
