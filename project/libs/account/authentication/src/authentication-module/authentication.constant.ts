export const AuthenticationExceptionMessage = {
  UserAlreadyExists: 'Пользователь с данным email уже существует!',
  UserNotFound: 'Пользователь не найден',
  UserPasswordWrong: 'Пароль пользователя не правильный'
} as const;

export const AuthenticationResponseMessage = {
  LoggedSuccess: 'Пользователь успешно вошел.',
  LoggedError: 'Пароль или логин неправильные.',
  UserFound: 'Пользователь найден.',
  UserNotFound: 'Пользователь не найден.',
  UserExist: 'Пользователь с таким email уже существует.',
  UserCreated: 'Новый пользователь был успешно создан.',
} as const;

export const AuthenticationUserNameLength = {
  Min: 3,
  Max: 50,
} as const;

export const AuthenticationUserPasswordLength = {
  Min: 6,
  Max: 12,
} as const;

export const AuthenticationValidateMessage = {
  EmailNotValid: 'Email не правильный',
  DateBirthNotValid: 'Дата рождения пользователя не правильная',
  FirstNameNotValid: 'Имя неверное',
  LastNameNotValid: 'Фамилия неверная',
  PasswordNotValid: 'Пароль неверный',
  FirstNameLengthNotValid: `Длинна имени должна быть от ${AuthenticationUserNameLength.Min} до ${AuthenticationUserNameLength.Max}`,
  LastNameLengthNotValid: `Длинна фамилии должна быть от ${AuthenticationUserNameLength.Min} до ${AuthenticationUserNameLength.Max}`,
  PasswordLengthNotValid: `Длинна пароля должна быть от ${AuthenticationUserPasswordLength.Min} до ${AuthenticationUserPasswordLength.Max}`,
  EmailRequired: 'Email обязателен',
  DateBirthRequired: 'Дата рождения обязательно',
  FirstNameRequired: 'Имя обязателено',
  LastNameRequired: 'Фамилия обязателена',
  PasswordRequired: 'Пароль обязателен',
} as const;
