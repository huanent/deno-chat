import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { addConnection, getConnectionNames } from "./socket.ts";

function handler(req: Request) {
  const url = new URL(req.url);

  if (url.pathname.includes("enter")) {
    try {
      const name = url.searchParams.get("name");
      if (!name) return new Response("Name param not found!");
      const { response, socket } = Deno.upgradeWebSocket(req);
      addConnection(name, socket);
      return response;
    } catch {
      return new Response("request isn't trying to upgrade to websocket.");
    }
  }

  if (url.pathname.includes("list")) {
    return new Response(JSON.stringify(getConnectionNames()));
  }

  return new Response("Not found");
}

serve(handler);
