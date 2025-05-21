import { Module } from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {AuthenticationController} from "./authentication.controller";
import {BlogUserModule} from "@project/blog-user";

@Module({
  imports: [BlogUserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
