import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator'

export class UpdateDto {
  @IsString()
  @IsOptional()
  username?: string

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  @MinLength(16, {
    message: 'Password must be at least 16 characters long'
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must include at least one uppercase letter'
  })
  password?: string
}
