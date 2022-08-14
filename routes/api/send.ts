import { HandlerContext } from "https://deno.land/x/fresh@1.0.2/server.ts";
import { ChannelMessage } from "../../types.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const url = new URL(_req.url);
  const name = url.searchParams.get("name");
  const data = await _req.json();
  const channel = new BroadcastChannel("chat");

  const message = {
    type: "message",
    data: {
      name,
      data,
    },
  } as ChannelMessage;

  channel.postMessage(JSON.stringify(message));
  channel.close();
  return new Response("message sent");
};
