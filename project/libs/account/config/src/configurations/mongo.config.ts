import {ConfigType, registerAs} from '@nestjs/config';
import {DEFAULT_MONGO_PORT} from "./mongodb/mongo.constant";
import {MongoConfiguration} from "./mongodb/mongo.env";
import {plainToClass} from "class-transformer";

async function getDbConfig(): Promise<MongoConfiguration> {
  const config = plainToClass(MongoConfiguration, {
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB,
    port: parseInt(process.env.MONGO_PORT ?? `${DEFAULT_MONGO_PORT}`, 10),
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    authBase: process.env.MONGO_AUTH_BASE,
  });

  await config.validate();
  return config;
}

export default registerAs('db', async (): Promise<ConfigType<typeof getDbConfig>> => {
  return getDbConfig();
});
