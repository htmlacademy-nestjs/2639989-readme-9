import {Module} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {AuthenticationController} from "./authentication.controller";
import {BlogUserModule} from "@project/blog-user";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {getJwtOptions} from "@project/account-config";
import {JwtAccessStrategy} from "../strategies/jwt-access.strategy";
import {NotifyModule} from "@project/account-notify";
import { LocalStrategy } from '../strategies/local.strategy';

@Module({
  imports: [BlogUserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    NotifyModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy, LocalStrategy],
})
export class AuthenticationModule {
}
