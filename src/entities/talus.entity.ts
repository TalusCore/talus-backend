import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('talus')
export class Talus {
  @ApiProperty({
    description: 'Unique identifier for the Talus',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'talus_id' })
  talusId: string;

  @ApiProperty({
    description: 'Name of the Talus',
    example: 'Talus 1'
  })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({
    type: () => [UserTalusRelation],
    description: 'The user relations associated with this Talus'
  })
  @OneToMany(() => UserTalusRelation, (relation) => relation.talus)
  userRelations: UserTalusRelation[];
}
