const pool: Record<string, WebSocket> = {};
const channel = new BroadcastChannel("ws");
const connections: string[] = [];

interface SocketChannelMessage {
  type: "enter" | "leave" | "message";
  data: string;
}

interface Message {
  from: string;
  data: string;
}

channel.onmessage = (event: MessageEvent) => {
  const message = JSON.parse(event.data) as SocketChannelMessage;

  switch (message.type) {
    case "enter":
      connections.push(message.data);
      break;

    case "leave":
      leaveRoom(message.data);
      break;

    case "message":
      handleMessage(message.data);
      break;

    default:
      break;
  }
};

function leaveRoom(name: string) {
  const index = connections.indexOf(name);
  if (index > -1) {
    connections.splice(index, 1);
    delete pool[name];
    pool[name]?.close();
  }
}

function handleMessage(data: string) {
  const message = JSON.parse(data) as Message;
  for (const key in pool) {
    if (key == message.from) return;
    pool[key].send(data);
  }
}

export function addConnection(name: string, socket: WebSocket) {
  socket.onopen = () => {
    channel.postMessage(
      JSON.stringify({
        type: "enter",
        data: name,
      } as SocketChannelMessage)
    );
    pool[name] = socket;
  };

  socket.onmessage = (e) => {
    const message = JSON.stringify({
      from: name,
      data: e.data,
    } as Message);

    channel.postMessage(
      JSON.stringify({
        type: "message",
        data: message,
      } as SocketChannelMessage)
    );
  };

  socket.onerror = () => {
    channel.postMessage(
      JSON.stringify({
        type: "leave",
        data: name,
      } as SocketChannelMessage)
    );
    delete pool[name];
  };

  socket.onclose = () => {
    channel.postMessage(
      JSON.stringify({
        type: "leave",
        data: name,
      } as SocketChannelMessage)
    );
    delete pool[name];
  };
}

export const getConnectionNames = () => Object.keys(pool);
