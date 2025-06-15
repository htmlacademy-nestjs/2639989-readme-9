export const CommentLength = {
  MIN: 10,
  MAX: 300,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100
} as const;

export const BlogCommentExceptionMessage = {
  PostNotFound: 'Публикация не найдена',
  CommentNotFound: 'Комментарий не найден',
  Forbidden: 'У вас нет прав для выполнения этой операции',
  CreateFailed: 'Не удалось создать комментарий',
  DeleteFailed: 'Не удалось удалить комментарий',
  GetFailed: 'Не удалось получить комментарии'
} as const;

export const BlogCommentResponseMessage = {
  CommentCreated: 'Комментарий успешно создан',
  CommentDeleted: 'Комментарий успешно удалён',
  CommentsFound: 'Список комментариев получен',
  CommentFound: 'Комментарий получен',
  LoggedError: 'Вы не имеете права на данное действие'
} as const;

export const BlogCommentValidateMessage = {
  TextNotString: 'Текст комментария должен быть строкой',
  TextRequired: 'Текст комментария обязателен',
  TextLengthNotValid: `Длина комментария должна быть от ${CommentLength.MIN} до ${CommentLength.MAX} символов`,
  UserIdNotValid: 'ID пользователя должен быть в формате UUID',
  PostIdNotValid: 'ID публикации должен быть в формате UUID',
  UserIdRequired: 'ID пользователя обязателен',
  PostIdRequired: 'ID публикации обязателен',
} as const;
