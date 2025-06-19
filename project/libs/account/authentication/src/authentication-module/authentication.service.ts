import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus, Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {BlogUserEntity, BlogUserRepository} from "@project/blog-user";
import {CreateUserDto} from "../dto/create-user.dto";
import dayjs from 'dayjs';
import {AuthenticationExceptionMessage} from "./authentication.constant";
import {LoginUserDto} from "../dto/login-user.dto";
import {Token, TokenPayload, User} from "@project/core";
import {JwtService} from '@nestjs/jwt';
import {ChangePasswordDto} from "../dto/change-password.dto";
import { jwtConfig } from '@project/account-config';
import {ConfigType} from "@nestjs/config";
import {createJWTPayload} from "@project/helpers";
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService
  ) {
  }

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const {email, firstname, lastname, password} = dto;

    const blogUser = {
      email, firstname, lastname,
      avatar: '', dateOfBirth: dayjs().toDate(),
      passwordHash: ''
    };

    const existUser = await this.blogUserRepository
      .findByEmail(email);

    if (existUser) {
      throw new ConflictException(AuthenticationExceptionMessage.UserAlreadyExists);
    }

    const userEntity = await new BlogUserEntity(blogUser)
      .setPassword(password)

    await this.blogUserRepository.save(userEntity);

    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto): Promise<BlogUserEntity> {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthenticationExceptionMessage.UserNotFound);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AuthenticationExceptionMessage.UserPasswordWrong);
    }

    return existUser;
  }

  public async getUser(id: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(id);

    if (!user) {
      throw new NotFoundException(AuthenticationExceptionMessage.UserNotFound);
    }

    return user;
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async changePassword(
    userId: string,
    dto: ChangePasswordDto
  ): Promise<BlogUserEntity> {
    const user = await this.getUser(userId);

    if (!await user.comparePassword(dto.currentPassword)) {
      throw new UnauthorizedException(AuthenticationExceptionMessage.UserPasswordWrong);
    }

    if (await user.comparePassword(dto.newPassword)) {
      throw new BadRequestException(AuthenticationExceptionMessage.SamePassword);
    }

    const updatedUser = await user.setPassword(dto.newPassword);
    await this.blogUserRepository.update(updatedUser);

    return updatedUser;
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (! existUser) {
      throw new NotFoundException(`Пользователь с email ${email} не найден`);
    }

    return existUser;
  }
}
