import 'multer';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthenticationResponseMessage, AVATAR_MAX_SIZE} from "./authentication.constant";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {LoggedUserRdo} from "../rdo/logged-user.rdo";
import {UserRdo} from '../rdo/user.rdo';
import {MongoIdValidationPipe} from "@project/pipes";
import {fillDto} from "@project/helpers";
import {NotifyService} from "@project/account-notify";
import {ChangePasswordDto} from "../dto/change-password.dto";
import {TokenPayload, UserDecorator} from "@project/core";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {RequestWithUser} from "./request-with-user.interface";
import {JwtRefreshGuard} from "../guards/jwt-refresh.guard";
import {RequestWithTokenPayload} from "./request-with-token-payload.interface";
import {FileInterceptor} from "@nestjs/platform-express";
import {AvatarFileFilter} from "./avatar.filter";
import {Express} from "express";
import {FileUploaderService} from "@project/file-uploader";

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly fileUploaderService: FileUploaderService,
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
  @UseInterceptors(FileInterceptor('avatar', {
    fileFilter: AvatarFileFilter,
    limits: { fileSize: AVATAR_MAX_SIZE },
  }))
  public async create(@Body() dto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    const avatar = await this.fileUploaderService.saveFile(file);
    const newUser = await this.authenticationService.register(dto, avatar.id);
    const userToken = await this.authenticationService.createUserToken(newUser);
    const {email, firstname, lastname} = newUser;
    await this.notifyService.registerSubscriber({email, firstname, lastname});
    await this.notifyService.addSubscriber({email, firstname, lastname});
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
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() {user}: RequestWithUser) {
    const userToken = await this.authenticationService.createUserToken(user);
    return fillDto(LoggedUserRdo, {...user.toPOJO(), ...userToken});
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

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получить новую пару JWT токенов'
  })
  public async refreshToken(@Req() {user}: RequestWithUser) {
    return this.authenticationService.createUserToken(user);
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
    @UserDecorator() user: TokenPayload,
    @Body() dto: ChangePasswordDto
  ) {
    const updatedUser = await this.authenticationService.changePassword(user.sub, dto);

    await this.notifyService.changePassword({
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname
    });

    return {
      success: true,
      message: 'Пароль успешно изменен'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(@Req() {user: payload}: RequestWithTokenPayload) {
    return payload;
  }
}
