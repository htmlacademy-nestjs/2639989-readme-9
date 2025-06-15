export const BlogLikeExceptionMessage = {
  PostNotFound: 'Публикация не найдена',
  LikeNotFound: 'Лайк не найден',
  Forbidden: 'У вас нет прав для выполнения операции',
  CreateFailed: 'Не удалось поставить лайк',
  DeleteFailed: 'Не удалось снять лайк',
  AlreadyExists: 'Лайк уже поставлен',
  PostNotPublished: 'Публикация еще не опубликована'
} as const;

export const BlogLikeResponseMessage = {
  Created: 'Лайк успешно поставлен',
  Deleted: 'Лайк успешно снят',
  LoggedError: 'Требуется авторизация'
} as const;

export const BlogLikeValidateMessage = {
  PostIdNotValid: 'ID публикации должен быть UUID',
  PostIdRequired: 'ID публикации обязателен'
} as const;
