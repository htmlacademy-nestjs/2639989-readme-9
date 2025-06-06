import { Prisma } from '@prisma/client';

export interface BlogCommentFilter {
  postId: string;
  limit?: number;
  offset?: number;
}

export function commentFilterToPrismaFilter(filter: BlogCommentFilter): Prisma.CommentWhereInput & { skip?: number; take?: number } {
  const prismaFilter: Prisma.CommentWhereInput & { skip?: number; take?: number } = {
    postId: filter.postId
  };

  if (typeof filter.limit === 'number') {
    prismaFilter.take = filter.limit;
  }
  if (typeof filter.offset === 'number') {
    prismaFilter.skip = filter.offset;
  }

  return prismaFilter;
}
