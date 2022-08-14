export interface ChannelMessage {
  type: "enter" | "leave" | "message";
  data: string | Message;
}

export interface Message {
  name: string;
  data: string;
}
