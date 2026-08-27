import { UserRole } from "@prisma/client"
import { IsEmail, isNotEmpty, IsNotEmpty, Matches, MaxLength, Min, MinLength } from "class-validator"


export class AuthenticatedUserPayload {
    userId! : bigint
    email! : string 
    role! : UserRole
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
        message : "name should not exceed 50 chars"
    })
    name! : string 
    
    @IsEmail()
    @IsNotEmpty()
    email! : string
    

    @MinLength(8, {
    message: 'Password must be at least 8 characters long',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
    message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
    })
    password! : string 

}