import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  let resp: Response;

  if (req.method === "OPTIONS") {
    resp = new Response("");
  } else {
    resp = await ctx.next();
  }

  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "*");
  resp.headers.set("Access-Control-Allow-Headers", "*");
  return resp;
}
