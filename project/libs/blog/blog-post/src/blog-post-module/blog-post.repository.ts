import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaClientService} from '@project/blog-models';
import {BasePostgresRepository} from '@project/data-access';
import {PaginationResult, Post} from '@project/core';
import {Prisma} from '@prisma/client';
import {BlogPostFactory} from './blog-post.factory';
import {BlogPostEntity} from "./blog-post.entity";
import {BLOG_POST_DEFAULT_OPTIONS, MAX_POSTS_LIMIT} from "./blog-post.constant";
import {BlogPostFilter, postFilterToPrismaFilter} from "./blog-post.filter";

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    try {
      const pojoEntity = entity.toPOJO();

      const tagConnect = pojoEntity.tags?.length
        ? {
          connectOrCreate: pojoEntity.tags.map(tag => ({
            where: {id: tag.id},
            create: {id: tag.id, name: tag.name}
          }))
        }
        : undefined;

      const data: Prisma.PostCreateInput = {
        userId: pojoEntity.userId,
        type: pojoEntity.type,
        payload: pojoEntity.payload,
        createdAt: new Date(),
        publishedAt: new Date(),
        status: pojoEntity.status,
        isRepost: pojoEntity.isRepost,
        originalPost: pojoEntity.originalPostId
          ? {connect: {id: pojoEntity.originalPostId}}
          : undefined,
        tags: tagConnect,
        likes: {
          connect: []
        },
        comments: {
          connect: []
        }
      };

      const created = await this.client.post.create({
        data,
        include: this.includeTagsAndRelations()
      });

      entity.id = created.id;
      entity.createdAt = created.createdAt;
      entity.publishedAt = created.publishedAt;
    } catch (err) {
      throw new Error(`Не удалось создать пост: ${err.message}`);
    }
  }

  public async update(entity: BlogPostEntity): Promise<void> {
    try {
      const pojoEntity = entity.toPOJO();

      const tagConnect = pojoEntity.tags?.length
        ? {
          set: pojoEntity.tags.map(tag => ({
            id: tag.id
          }))
        }
        : undefined;

      const data: Prisma.PostUpdateInput = {
        payload: pojoEntity.payload,
        publishedAt: pojoEntity.publishedAt,
        status: pojoEntity.status,
        isRepost: pojoEntity.isRepost,
        tags: tagConnect
      };

      if (!pojoEntity.isRepost) {
        data.originalPost = pojoEntity.originalPostId
          ? {connect: {id: pojoEntity.originalPostId}}
          : {disconnect: true};
      }

      await this.client.post.update({
        where: {id: pojoEntity.id},
        data,
        include: this.includeTagsAndRelations()
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`Пост с id ${entity.id} не найден.`);
        }
      }
      throw new Error(`Не удалось обновить пост: ${err.message}`);
    }
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const record = await this.client.post.findUnique({
      where: {id},
      include: this.includeTagsAndRelations()
    });

    if (!record) {
      throw new NotFoundException(`Пост с id ${id} не найден.`);
    }

    return this.createEntityFromDocument(record);
  }

  public async findRelatedPosts(
    authorId: string,
    count: number = MAX_POSTS_LIMIT
  ): Promise<BlogPostEntity[]> {
    const records = await this.client.post.findMany({
      where: {
        userId: authorId,
        status: 'PUBLISHED',
        NOT: {isRepost: true}
      },
      take: count,
      orderBy: {createdAt: 'desc'},
      include: this.includeTagsAndRelations()
    });

    return records.map(record => this.createEntityFromDocument(record));
  }

  public async find(
    filter?: BlogPostFilter
  ): Promise<PaginationResult<BlogPostEntity>> {
    const where = filter ? postFilterToPrismaFilter(filter) : {};
    const sortDirection = filter?.sortDirection || 'desc';

    const skip = filter?.page && filter?.limit
      ? (filter.page - 1) * filter.limit
      : undefined;
    const take = filter?.limit;

    where.status = filter?.status;
    where.isRepost = filter?.includeReposts ? undefined : false;

    if (filter?.postTypes) {
      where.type = {
        in: filter.postTypes
      };
    }

    const [records, postsCount] = await Promise.all([
      this.client.post.findMany({
        where,
        take,
        skip,
        orderBy: {createdAt: sortDirection},
        include: this.includeTagsAndRelations()
      }),
      this.getPostCount(where)
    ]);

    return {
      entities: records.map(record => this.createEntityFromDocument(record)),
      currentPage: filter?.page || 1,
      totalPages: this.calculatePostsPage(postsCount, take),
      itemsPerPage: take,
      totalItems: postsCount
    };
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.client.like.deleteMany({where: {postId: id}});
      await this.client.comment.deleteMany({where: {postId: id}});
      await this.client.post.delete({
        where: {id}
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`Пост с id ${id} не найден.`);
        }
      }
      throw new Error(`Не удалось удалить пост: ${err.message}`);
    }
  }

  public async findByIds(ids: string[]): Promise<BlogPostEntity[]> {
    const records = await this.client.post.findMany({
      where: {
        id: {in: ids}
      },
      include: this.includeTagsAndRelations()
    });

    return records.map(record => this.createEntityFromDocument(record));
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({where});
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  private includeTagsAndRelations(
    includeOptions: Prisma.PostInclude = BLOG_POST_DEFAULT_OPTIONS
  ) {
    return includeOptions;
  }
}
