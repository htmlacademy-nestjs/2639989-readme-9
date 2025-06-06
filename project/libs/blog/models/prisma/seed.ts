import {PostStatus, PostType, PrismaClient} from '@prisma/client';

const FIRST_USER_ID  = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';
const THIRD_USER_ID  = '6581767701234abcd1234ef56';

const TAG_BOOKS_ID     = '39614113-7ad5-45b6-8093-06455437e1e2';
const TAG_COMPUTERS_ID = 'efd775e2-df55-4e0e-a308-58249f5ea202';
const TAG_QUOTE_ID     = 'b1a2c3d4-e5f6-7890-ab12-cd34ef56ab78';

const FIRST_POST_ID  = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_ID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';
const THIRD_POST_ID  = 'c0ffee00-baad-f00d-dead-beef12345678';

function getTags() {
  return [
    { id: TAG_BOOKS_ID,     name: 'Книги' },
    { id: TAG_COMPUTERS_ID, name: 'Компьютеры' },
    { id: TAG_QUOTE_ID,     name: 'Цитаты' },
  ];
}

function getPosts() {
  return [
    {
      id: FIRST_POST_ID,
      userId: FIRST_USER_ID,
      type: PostType.TEXT,
      payload: {
        textTitle:   'Мой первый пост',
        textPreview: 'Это предварительный текст моего первого поста',
        textContent: 'Полный текст поста. Здесь может быть от 100 до 1024 символов...'
      },
      status: PostStatus.PUBLISHED,
      tags: {
        connect: [{ id: TAG_BOOKS_ID }]
      },
      comments: {
        create: [
          {
            id: 'comment-0001-0001-0001-000000000001',
            userId: FIRST_USER_ID,
            text: 'Отличный текстовый пост!',
          },
          {
            id: 'comment-0001-0001-0001-000000000002',
            userId: SECOND_USER_ID,
            text: 'Очень информативно, спасибо!',
          }
        ]
      },
      likes: {
        create: [
          {
            userId: SECOND_USER_ID,
          },
          {
            userId: THIRD_USER_ID,
          }
        ]
      },
    },
    {
      id: SECOND_POST_ID,
      userId: SECOND_USER_ID,
      type: PostType.VIDEO,
      payload: {
        videoTitle: 'Обзор новых технологий',
        videoUrl:   'https://www.youtube.com/watch?v=example123'
      },
      status: PostStatus.PUBLISHED,
      tags: {
        connect: [
          { id: TAG_COMPUTERS_ID },
          { id: TAG_QUOTE_ID }
        ]
      },
      comments: {
        create: [
          {
            id: 'comment-0002-0002-0002-000000000003',
            userId: FIRST_USER_ID,
            text: 'Спасибо за обзор, очень познавательно!',
          }
        ]
      },
      likes: {
        create: [
          {
            userId: FIRST_USER_ID,
          }
        ]
      },
    },
    {
      id: THIRD_POST_ID,
      userId: THIRD_USER_ID,
      type: PostType.QUOTE,
      payload: {
        quoteText:   'Жизнь – это то, что происходит, пока вы строите планы.',
        quoteAuthor: 'Джон Леннон'
      },
      status: PostStatus.DRAFT,
      tags: {
        connect: [{ id: TAG_QUOTE_ID }]
      },
    }
  ];
}

function getSubscriptions() {
  return [
    {
      followerId:  FIRST_USER_ID,
      followingId: SECOND_USER_ID,
    },
    {
      followerId:  FIRST_USER_ID,
      followingId: THIRD_USER_ID,
    },
    {
      followerId:  SECOND_USER_ID,
      followingId: FIRST_USER_ID,
    }
  ];
}

async function seedDb(prisma: PrismaClient) {
  const tags = getTags();
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id:   tag.id,
        name: tag.name
      }
    });
  }

  const posts = getPosts();
  for (const post of posts) {
    const { comments, likes, tags: tagsConnect, ...postData } = post;

    await prisma.post.create({
      data: {
        id:          postData.id,
        userId:      postData.userId,
        type:        postData.type,
        payload:     postData.payload,
        status:      postData.status,
        publishedAt: new Date(),
        tags:        tagsConnect,
        comments:    comments ?? undefined,
        likes:       likes ?? undefined
      }
    });
  }

  const subscriptions = getSubscriptions();
  for (const sub of subscriptions) {
    await prisma.subscription.upsert({
      where: {
        followerId_followingId: {
          followerId:  sub.followerId,
          followingId: sub.followingId
        }
      },
      update: {},
      create: {
        followerId:  sub.followerId,
        followingId: sub.followingId
      }
    });
  }

  console.info('✅ База PostgreSQL тестово заполнена.');
}

async function main() {
  const prisma = new PrismaClient();

  try {
    await seedDb(prisma);
  } catch (error) {
    console.error('❌ Error in seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
