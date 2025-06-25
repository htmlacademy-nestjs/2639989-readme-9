export const TitleLength = {
  Min: 20,
  Max: 50,
} as const;

export const TextLength = {
  AnnounceMin: 50,
  AnnounceMax: 255,
  TextMin: 100,
  TextMax: 1024,
  QuoteMin: 20,
  QuoteMax: 300,
  LinkDescMax: 300,
} as const;

export const AuthenticationUserNameLength = {
  Min: 3,
  Max: 50
} as const;

export const TagLength = {
  Min: 3,
  Max: 10
} as const;

export const MAX_TAGS_PER_POST = 8;

export const PostValidateMessage = {
  TypeRequired: 'Тип публикации обязателен',
  TypeNotValid: 'Неподдерживаемый тип публикации',
  PayloadRequired: 'Содержание публикации обязательно',
  TitleRequired: 'Заголовок обязателен',
  TitleMinLengthNotValid: `Заголовок должен быть от ${TitleLength.Min} до ${TitleLength.Max} символов`,
  TitleMaxLengthNotValid: `Заголовок должен быть от ${TitleLength.Min} до ${TitleLength.Max} символов`,
  AnnounceMinLengthNotValid: `Анонс должен быть от ${TextLength.AnnounceMin} до ${TextLength.AnnounceMax} символов`,
  TextMinLengthNotValid: `Текст публикации должен быть от ${TextLength.TextMin} до ${TextLength.TextMax} символов`,
  QuoteMinLengthNotValid: `Цитата должна быть от ${TextLength.QuoteMin} до ${TextLength.QuoteMax} символов`,
  QuoteAuthorMinLengthNotValid: `Автор цитаты должен быть от ${AuthenticationUserNameLength.Min} до ${AuthenticationUserNameLength.Max} символов`,
  URLNotValid: 'URL должен быть валидной ссылкой',
  YouTubeURLNotValid: 'Ссылка должна быть на YouTube видео',
  PhotoURLRequired: 'Ссылка на фото обязательна',
  DescriptionMaxLengthNotValid: `Описание ссылки должно быть не более ${TextLength.LinkDescMax} символов`,
  TagNotString: 'Тег должен быть строкой',
  TagPatternNotValid: 'Тег должен начинаться с буквы и содержать только буквы и цифры',
  TagMinLengthNotValid: `Тег должен быть от ${TagLength.Min} до ${TagLength.Max} символов`,
  TagMaxLengthNotValid: `Тег должен быть от ${TagLength.Min} до ${TagLength.Max} символов`,
  TooManyTags: `Максимальное количество тегов: ${MAX_TAGS_PER_POST}`,
  StatusNotValid: 'Статус должен быть DRAFT или PUBLISHED',
  PhotoNecessary: 'Фото обязательно для поста типа "Фото"'
} as const;

export const VideoValidation = {
  YoutubeRegex: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
} as const;

export const PhotoValidation = {
  MaxSize: 1000000, // 1 MB
  MimeTypes: ['image/jpeg', 'image/png'],
};

export const AvailablePostType = {
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
  QUOTE: 'QUOTE',
  PHOTO: 'PHOTO',
  LINK: 'LINK',
} as const;

export const AvailablePostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export const TAG_REGEX = /^[a-zа-яё][a-zа-яё0-9]*$/i;

export const MAX_POSTS_LIMIT = 25;

export const BLOG_POST_DEFAULT_OPTIONS = {
  author: {
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true
    }
  },
  tags: {
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  },
  likes: true,
  comments: true
};

export const PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
} as const;

export const PHOTO_MAX_SIZE = 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

