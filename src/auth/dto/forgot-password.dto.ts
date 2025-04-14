import { IsString } from "class-validator";

// forgot-password.dto.ts
export class ForgotPasswordDto {
    @IsString()
    email: string
  }
  