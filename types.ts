export interface ChannelMessage {
  type: "enter" | "leave" | "message";
  from:string
  data: string | Message;
}

export interface Message {
  to?: string;
  type:string
  data: string;
}
