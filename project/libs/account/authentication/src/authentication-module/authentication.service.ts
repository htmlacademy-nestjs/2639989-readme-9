import {ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {BlogUserEntity, BlogUserRepository} from "@project/blog-user";
import {CreateUserDto} from "../dto/create-user.dto";
import dayjs from 'dayjs';
import {AuthenticationExceptionMessage} from "./authentication.constant";
import {LoginUserDto} from "../dto/login-user.dto";
import {dbConfig} from '@project/account-config';
import {ConfigType} from "@nestjs/config";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    @Inject(dbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof dbConfig>,
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
}
