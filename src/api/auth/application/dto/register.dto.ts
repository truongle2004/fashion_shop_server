import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength
} from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(16, {
    message: 'Password must be at least 16 characters long'
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must include at least one uppercase letter'
  })
  password: string
}
