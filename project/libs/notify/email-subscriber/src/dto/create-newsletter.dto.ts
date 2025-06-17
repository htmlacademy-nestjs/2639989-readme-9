import {Post, User} from "@project/core";

export class CreateNewsletterDto {
  public user: User;
  public posts: Post[];
  public created: Date;
}
