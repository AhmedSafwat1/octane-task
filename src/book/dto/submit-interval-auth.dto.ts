import { OmitType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { SubmitIntervalDto } from './submit-interval.dto';

export class SubmitIntervalAuthDto extends OmitType(SubmitIntervalDto, [
  'user_id',
] as const) {
  @IsInt()
  @IsOptional()
  user_id: number;
}
