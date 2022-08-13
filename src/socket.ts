const pool: Record<string, WebSocket> = {};

export function addConnection(name: string, socket: WebSocket) {
  socket.onopen = () => {
    pool[name] = socket;
  };

  socket.onmessage = (e) => {
    for (const key in pool) {
      if (key == name) return;

      const message = JSON.stringify({
        from: name,
        data: e.data,
      });

      pool[key].send(message);
    }
  };

  socket.onerror = () => {
    delete pool[name];
  };

  socket.onclose = () => {
    delete pool[name];
  };
}

export const getConnectionNames=()=>Object.keys(pool);
