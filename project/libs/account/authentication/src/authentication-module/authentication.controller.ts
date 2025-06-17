import {Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {LoginUserDto} from "../dto/login-user.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthenticationResponseMessage} from "./authentication.constant";
import {LoggedUserRdo} from "../rdo/logged-user.rdo";
import {UserRdo} from '../rdo/user.rdo';
import {MongoIdValidationPipe} from "@project/pipes";
import {fillDto} from "@project/helpers";
import {NotifyService} from "@project/account-notify";
import {JwtAuthGuard} from "@project/authentication";
import {ChangePasswordDto} from "../dto/change-password.dto";
import {UserDecorator} from "@project/core";

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly notifyService: NotifyService,) {
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
    const { email, firstname, lastname } = newUser;
    await this.notifyService.registerSubscriber({ email, firstname, lastname });
    return fillDto(LoggedUserRdo, {...newUser.toPOJO(), ...userToken});
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
    return fillDto(LoggedUserRdo, {...verifiedUser.toPOJO(), ...userToken});
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

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Пароль успешно изменен',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверный текущий пароль',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Новый пароль совпадает со старым',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  public async changePassword(
    @UserDecorator('sub') userId: string,
    @Body() dto: ChangePasswordDto
  ) {
    const updatedUser = await this.authenticationService.changePassword(userId, dto);

    await this.notifyService.registerSubscriber({
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname
    });

    return {
      success: true,
      message: 'Пароль успешно изменен'
    };
  }
}
