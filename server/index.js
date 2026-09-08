import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT) || 3001;
const directory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(directory, "../dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distDirectory, { maxAge: "1d", etag: true }));
  app.get("/{*path}", (_request, response) => {
    response.sendFile(path.join(distDirectory, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Lexora disponível em http://localhost:${port}`);
});
