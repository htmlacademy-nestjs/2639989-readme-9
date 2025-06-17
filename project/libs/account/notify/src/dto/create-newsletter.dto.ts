import {BlogUserEntity} from "@project/blog-user";
import {BlogPostEntity} from "@project/blog-post";

export class CreateNewsletterDto {
  public user: BlogUserEntity;
  public posts: BlogPostEntity[];
  public created: Date;
}
