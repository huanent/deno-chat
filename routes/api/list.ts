import { users } from "./listen.ts";

export const handler = (_req: Request): Response => {
  return new Response(JSON.stringify(users));
};
