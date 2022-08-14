import { HandlerContext } from "https://deno.land/x/fresh@1.0.2/server.ts";
import { ChannelMessage, Message } from "../../types.ts";

export const users: string[] = [];

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const url = new URL(_req.url);
  const name = url.searchParams.get("name");
  const channel = new BroadcastChannel("chat");

  const stream = new ReadableStream({
    start: (controller) => {
      controller.enqueue(": Welcome to Deno Chat!\n\n");

      channel.postMessage(
        JSON.stringify({
          type: "enter",
          data: name,
        } as ChannelMessage)
      );

      function handlerMessage(message: Message) {
        if (message.name != name) {
          controller.enqueue(`data: ${JSON.stringify(message.data)}\n\n`);
        }
      }

      channel.onmessage = (e) => {
        const message = JSON.parse(e.data) as ChannelMessage;

        switch (message.type) {
          case "enter":
            if (typeof message.data == "string") users.push(message.data);
            break;
          case "leave":
            if (typeof message.data == "string") {
              users.splice(users.indexOf(message.data), 1);
            }
            break;
          case "message":
            handlerMessage(message.data as Message);
            break;

          default:
            break;
        }
      };
    },
    cancel() {
      channel.postMessage(
        JSON.stringify({
          type: "leave",
          data: name,
        } as ChannelMessage)
      );
      channel.close();
    },
  });

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: { "content-type": "text/event-stream" },
  });
};
