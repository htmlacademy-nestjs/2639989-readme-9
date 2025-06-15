import {Body, Controller, Get, HttpStatus, Param, Post} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {LoginUserDto} from "../dto/login-user.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthenticationResponseMessage} from "./authentication.constant";
import {LoggedUserRdo} from "../rdo/logged-user.rdo";
import {UserRdo} from '../rdo/user.rdo';
import {MongoIdValidationPipe} from "@project/pipes";
import {fillDto} from "@project/helpers";

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserCreated,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.UserExist,
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authenticationService.register(dto);
    const userToken = await this.authenticationService.createUserToken(newUser);
    return fillDto(LoggedUserRdo, { ...newUser.toPOJO(), ...userToken });
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.LoggedSuccess,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.LoggedError,
  })
  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authenticationService.verifyUser(dto);
    const userToken = await this.authenticationService.createUserToken(verifiedUser);
    return fillDto(LoggedUserRdo, { ...verifiedUser.toPOJO(), ...userToken });
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.UserFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound,
  })
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.authenticationService.getUser(id);
    return existUser.toPOJO();
  }
}
