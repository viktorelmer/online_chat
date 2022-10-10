import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { 
    NODE_ENV, 
    PORT,
    DB_HOST,
    DB_PORT, 
    DB_USER, 
    DB_PASSWORD, 
    DB_DATABASE, 
    SECRET_KEY, 
    LOG_FORMAT, 
    LOG_DIR, 
    ORIGIN, 
    PUSHER_APP_ID, 
    PUSHER_KEY, 
    PUSHER_SECRET, 
    PUSHER_CLUSTER,
} = process.env;