import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import { listen, users } from "./listen.ts";
import { send } from "./send.ts";
import App from "./App.jsx";

function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("");
  }

  const url = new URL(req.url);
  const name = url.searchParams.get("name");

  if (url.pathname.includes("listen")) {
    if (!name) return new Response("name not Found", { status: 400 });
    return listen(name);
  }

  if (url.pathname.includes("send")) {
    if (!name) return new Response("name not Found", { status: 400 });
    return send(name, req.json());
  }

  if (url.pathname.includes("list")) {
    return new Response(JSON.stringify(users));
  }

  const html = renderSSR(App);

  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}

function withCors(req: Request){
 const rsp=  handler(req);
 rsp.headers.set("Access-Control-Allow-Origin", "*");
 rsp.headers.set("Access-Control-Allow-Methods", "*");
 rsp.headers.set("Access-Control-Allow-Headers", "*");
 return rsp;
}

serve(withCors);
