export const AUTH_USER_EXISTS = 'Пользователь с данным email уже существует!';
export const AUTH_USER_NOT_FOUND = 'Пользователь не найден';
export const AUTH_USER_PASSWORD_WRONG = 'Пароль пользователя не правильный';

export const AuthenticationResponseMessage = {
  LoggedSuccess: 'Пользователь успешно вошел.',
  LoggedError: 'Пароль или логин неправильные.',
  UserFound: 'Пользователь найден.',
  UserNotFound: 'Пользователь не найден.',
  UserExist: 'Пользователь с таким email уже существует.',
  UserCreated: 'Новый пользователь был успешно создан.',
} as const;

export const AuthenticationValidateMessage = {
  EmailNotValid: 'Email не правильный',
  DateBirthNotValid: 'Дата рождения пользователя не правильная',
} as const;
