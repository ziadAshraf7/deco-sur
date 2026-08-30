import { UserRole } from "@prisma/client"
import { IsEmail, isNotEmpty, IsNotEmpty, IsString, Matches, MaxLength, Min, MinLength } from "class-validator"


export class AuthenticatedUserPayload {
    userId! : bigint
    email! : string 
    role! : UserRole
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email! : string

    @IsNotEmpty()
    password!: string;
}

export class RegisterDto {
    @IsNotEmpty()
    @MaxLength(50 , {
        message : 'messages.nameTooLong'
    })
    name! : string 
    
    @IsEmail()
    @IsNotEmpty()
    email! : string
    

    @MinLength(8, {
    message: 'messages.passwordTooShort',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
    message:
        'messages.passwordNeedsComplexity',
    })
    password! : string 

}