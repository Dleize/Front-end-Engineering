import express from "express";
import { words } from "./words.js";

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("X-Content-Type-Options", "nosniff");
    if (request.method === "OPTIONS") return response.sendStatus(204);
    next();
  });

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", words: words.length });
  });

  app.get("/api/words", (request, response) => {
    const requestedCount = Number.parseInt(request.query.count, 10);
    const count = Number.isFinite(requestedCount)
      ? Math.min(Math.max(requestedCount, 1), 12)
      : 5;

    response.setHeader("Cache-Control", "no-store");
    response.json(shuffle(words).slice(0, count));
  });

  return app;
}
