import {AuthUser, Entity, StorableEntity} from "@project/core";
import {compare, genSalt, hash} from "bcrypt";
import {SALT_ROUNDS} from "./blog-user.constant";

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public avatar: string;
  public email: string;
  public firstname: string;
  public lastname: string;
  public dateOfBirth: Date;
  public passwordHash: string;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }

  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }

    this.id = user.id ?? '';
    this.avatar = user.avatar;
    this.email = user.email;
    this.dateOfBirth = user.dateOfBirth;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.passwordHash = user.passwordHash;
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      avatar: this.avatar,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      dateOfBirth: this.dateOfBirth,
      passwordHash: this.passwordHash,
    }
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
