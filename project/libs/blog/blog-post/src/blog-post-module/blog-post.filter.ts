import { Prisma } from '@prisma/client';
import { PostType } from '@project/core';

interface BlogPostFilter {
  postTypes?: PostType[];
  authorId?: string;
  tagIds?: string[];
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
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
        id: { in: filter.tagIds }
      }
    };
  }

  return where;
};

export { BlogPostFilter };
