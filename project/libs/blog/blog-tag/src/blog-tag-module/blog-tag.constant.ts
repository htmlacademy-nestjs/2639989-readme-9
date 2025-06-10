export const TAGS_LIMIT = {
  MaxPerPost: 8,
  Default: 25,
  Max: 100
};

export const TagValidation = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 10,
  REGEX: /^[a-zа-яё][a-zа-яё0-9]*$/i
} as const;

export const TagExceptionMessage = {
  NotFound: 'Тег не найден',
  Conflict: 'Тег с таким именем уже существует',
  Forbidden: 'У вас нет прав на выполнение операции',
  CreateFailed: 'Не удалось создать тег',
  UpdateFailed: 'Не удалось обновить тег',
  DeleteFailed: 'Не удалось удалить тег',
  GetFailed: 'Не удалось получить теги',
  UsedInPosts: 'Тег используется в публикациях и не может быть удалён',
  TooManyTags: `Максимальное количество тегов на публикацию: ${TAGS_LIMIT.Max}`,
  InvalidTagName: 'Недопустимое имя тега',
  NotAllFound: 'Не найдены теги с id:'
} as const;

export const TagResponseMessage = {
  Created: 'Тег успешно создан',
  Deleted: 'Тег успешно удалён',
  Updated: 'Тег успешно обновлён',
  LoggedError: 'Требуется авторизация',
  Details: 'Данные тега',
  List: 'Список тегов'
} as const;

export const TagValidateMessage = {
  Required: 'Имя тега обязательно',
  MustBeString: 'Тег должен быть строкой',
  TooShort: `Длина тега от ${TagValidation.MIN_LENGTH} символов`,
  TooLong: `Длина тега до ${TagValidation.MAX_LENGTH} символов`,
  InvalidFormat: 'Тег должен начинаться с буквы и содержать только буквы и цифры'
} as const;
