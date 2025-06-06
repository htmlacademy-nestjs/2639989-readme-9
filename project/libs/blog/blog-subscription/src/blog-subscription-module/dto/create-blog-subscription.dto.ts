import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBlogSubscriptionDto {
  @ApiProperty({
    description: 'UUID подписчика (followerId)',
    example: '658170cbb954e9f5b905ccf4'
  })
  @IsUUID()
  @IsNotEmpty()
  public followerId!: string;

  @ApiProperty({
    description: 'UUID того, на кого подписываются (followingId)',
    example: '6581762309c030b503e30512'
  })
  @IsUUID()
  @IsNotEmpty()
  public followingId!: string;
}
