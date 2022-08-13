/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

export default function App() {
  return (
    <html>
      <head>
        <title>Deno chat</title>
      </head>
      <body>
        <h1>Deno chat</h1>
      </body>
    </html>
  );
}
