import {Prisma} from '@prisma/client';
import {PostStatus, PostType} from "@project/core";

export interface BlogPostFilter {
  id?: string;
  userId?: string;
  type?: PostType;
  status?: PostStatus;
  isRepost?: boolean;
  tagNames?: string[];
}

export function postFilterToPrismaFilter(filter: BlogPostFilter): Prisma.PostWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  const where: Prisma.PostWhereInput = {};

  if (filter.id) {
    where.id = filter.id;
  }
  if (filter.userId) {
    where.userId = filter.userId;
  }
  if (filter.type) {
    where.type = filter.type;
  }
  if (filter.status) {
    where.status = filter.status;
  }
  if (typeof filter.isRepost === 'boolean') {
    where.isRepost = filter.isRepost;
  }

  if (filter.tagNames && filter.tagNames.length > 0) {
    where.tags = {
      some: {
        name: {
          in: filter.tagNames,
        },
      },
    };
  }

  return where;
}
