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
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_talus_relation')
export class UserTalusRelation {
  @ApiProperty({
    description: 'UUID of the Talus',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @PrimaryColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @ApiProperty({
    type: () => Talus,
    description: 'Associated Talus'
  })
  @ManyToOne(() => Talus, (talus) => talus.userRelations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'talus_id' })
  talus: Talus;

  @ApiProperty({
    description: 'UUID of the User',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ApiProperty({
    type: () => User,
    description: 'Associated User'
  })
  @ManyToOne(() => User, (user) => user.talusRelations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Date when the user was paired with the Talus',
    example: '2023-06-20T10:00:00Z'
  })
  @CreateDateColumn({ name: 'pairing_date', type: 'timestamptz' })
  pairingDate: Date;

  @ApiProperty({
    type: () => [Stat],
    description: 'Statistics related to this user-talus relation'
  })
  @OneToMany(() => Stat, (stat) => stat.userTalusRelation)
  stats: Stat[];
}
