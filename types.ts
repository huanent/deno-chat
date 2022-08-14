export interface ChannelMessage {
  type: "enter" | "leave" | "message";
  data: string | Record<string, string>;
}
