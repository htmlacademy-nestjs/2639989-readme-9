import {Prisma} from '@prisma/client';
import {PostStatus, PostType} from '@project/core';

interface BlogPostFilter {
  status?: PostStatus;
  postTypes?: PostType[];
  startDate?: Date;
  authorId?: string;
  tagIds?: string[];
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  originalPostId?: string;
  includeReposts?: boolean;
}

export const postFilterToPrismaFilter = (filter: BlogPostFilter): Prisma.PostWhereInput => {
  const where: Prisma.PostWhereInput = {};

  if (filter.authorId) {
    where.userId = filter.authorId;
  }

  if (filter.tagIds && filter.tagIds.length > 0) {
    where.tags = {
      some: {
        id: {in: filter.tagIds}
      }
    };
  }

  if (filter.startDate) {
    (where.AND as Prisma.PostWhereInput[]).push({
      publishedAt: {gte: filter.startDate}
    });
  }

  if(filter.status){
    where.status = filter.status;
  }

  if(!filter.includeReposts){
    where.isRepost = false;
  }

  if(filter.originalPostId){
    where.originalPostId = filter.originalPostId;
  }

  if (filter?.postTypes) {
    where.type = {
      in: filter.postTypes
    };
  }

  return where;
};

export {BlogPostFilter};
