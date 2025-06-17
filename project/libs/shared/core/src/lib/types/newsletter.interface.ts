import {Post, User} from "@project/core";

export interface Newsletter {
  user: User;
  posts: Post[];
  created: Date;
}
