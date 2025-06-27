import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { UserTalusRelation } from './user-talus-relation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe'
  })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com'
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @ApiProperty({
    description: 'Password hash of the user',
    example: '$2b$10$EIXh8...',
    writeOnly: true
  })
  @Column({ type: 'text' })
  password: string;

  @ApiProperty({
    description: 'Timestamp when the account was created',
    example: '2023-01-01T12:00:00Z'
  })
  @CreateDateColumn({ name: 'account_creation', type: 'timestamptz' })
  accountCreation: Date;

  @ApiProperty({
    type: () => [UserTalusRelation],
    description: 'The talus relations associated with this user'
  })
  @OneToMany(() => UserTalusRelation, (relation) => relation.user)
  talusRelations: UserTalusRelation[];
}
