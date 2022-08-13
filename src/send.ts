import { ChannelMessage } from "./types.ts";

export function send(name: string, data: any) {
  const channel = new BroadcastChannel("chat");

  const message = {
    type: "message",
    data: {
      name,
      data,
    },
  } as ChannelMessage;

  channel.postMessage(message);
  channel.close();
  return new Response("message sent");
}
