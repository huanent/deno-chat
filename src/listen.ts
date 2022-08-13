import { ChannelMessage } from "./types.ts";

export const users: string[] = [];

export function listen(name: string): Response {
  const channel = new BroadcastChannel("chat");

  const stream = new ReadableStream({
    start: (controller) => {
      channel.postMessage(
        JSON.stringify({
          type: "enter",
          data: name,
        } as ChannelMessage)
      );

      channel.onmessage = (e) => {
        const message = JSON.parse(e.data) as ChannelMessage;

        switch (message.type) {
          case "enter":
            if (typeof message.data == "string") users.push(message.data);
            break;
          case "leave":
            if (typeof message.data == "string"){
                users.splice(users.indexOf(message.data), 1);
            }
            break;
          case "message":
            controller.enqueue(message.data);
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
}
