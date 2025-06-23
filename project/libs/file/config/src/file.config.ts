import {registerAs} from '@nestjs/config';
import * as Joi from 'joi';
import {DEFAULT_MONGO_PORT, DEFAULT_PORT, ENVIRONMENTS} from "./file-config.constant";


type Environment = typeof ENVIRONMENTS[number];

export interface FileVaultConfig {
  environment: string;
  port: number;
  uploadDirectory: string;
  db: {
    host: string;
    port: number;
    user: string;
    name: string;
    password: string;
    authBase: string;
  };
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS).required(),
  port: Joi.number().port().default(DEFAULT_PORT),
  uploadDirectory: Joi.string().required(),
  db: Joi.object({
    host: Joi.string().valid().hostname(),
    port: Joi.number().port(),
    name: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    authBase: Joi.string().required(),
  })
});

function validateConfig(config: FileVaultConfig): void {
  const {error} = validationSchema.validate(config, {abortEarly: true});
  if (error) {
    throw new Error(`[Ошибка валидации конфига для сервиса файлов]: ${error.message}`);
  }
}

function getConfig(): FileVaultConfig {
  const config: FileVaultConfig = {
    environment: process.env.NODE_ENV as Environment,
    port: parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10),
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
    db: {
      host: process.env.MONGO_HOST,
      port: parseInt(process.env.MONGO_PORT ?? DEFAULT_MONGO_PORT.toString(), 10),
      name: process.env.MONGO_DB,
      user: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
      authBase: process.env.MONGO_AUTH_BASE,
    }
  };

  validateConfig(config);
  return config;
}

export default registerAs('application', getConfig);
