import {Tag} from "./tag.interface";
import {Like} from "./like.interface";

export interface Post {
  id?: string;
  userId: string;
  type: PostType;
  payload: Record<string, any>;
  createdAt?: Date;
  publishedAt?: Date;
  status: PostStatus;
  isRepost: boolean;
  originalPostId?: string;
  reposts?: Post[];
  tags?: Tag[];
  likes?: Like[];
  comments?: Comment[];
}

export type PostType = 'TEXT' | 'VIDEO' | 'QUOTE' | 'PHOTO' | 'LINK';
export type PostStatus = 'DRAFT' | 'PUBLISHED';
