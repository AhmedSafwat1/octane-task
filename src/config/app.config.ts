import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  debug: process.env.APP_DEBUG === 'true',
  name: process.env.APP_NAME || 'Book Reading API',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
})); 