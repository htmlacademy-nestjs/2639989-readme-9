import { Module } from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {AuthenticationController} from "./authentication.controller";
import {BlogUserRepository} from "@project/blog-user";

@Module({
  imports: [BlogUserRepository],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
