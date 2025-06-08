import {Prisma} from '@prisma/client';

export interface TagFilter {
  id?: string;
  name?: string;
}

export function tagFilterToPrismaFilter(filter: TagFilter): Prisma.TagWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  let prismaFilter: Prisma.TagWhereInput = {};

  if (filter.name) {
    prismaFilter = {name: filter.name};
  }

  return prismaFilter;
}

