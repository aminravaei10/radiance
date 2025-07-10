import { defineConfig } from 'drizzle-kit';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/user/schema',
});
