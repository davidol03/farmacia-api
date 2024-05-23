import { config } from "dotenv";
config();
//Puerto de app 
export const PORT = process.env.PORT;
//BD Mongo
export const DB_HOST = process.env.DB_HOST;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT;
//jwt
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES = process.env.JWT_EXPIRES;
//url
export const URL = process.env.URL;