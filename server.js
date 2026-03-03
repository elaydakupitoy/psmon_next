const { createServer } = require("http");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";

if (dev) {
  console.log(
    "server.js is intended for production use only. In development run `npm run dev` or `npm run dev:all` to start Next and the WS server.",
  );
  process.exit(0);
}
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    return handle(req, res);
  });

  // WebSocket server mounted on the same HTTP server
  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const { url } = request;
    if (url === "/api/ws" || url?.startsWith("/api/ws")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    console.log("WS client connected");
    ws.send(JSON.stringify({ percent: Math.round(Math.random() * 100) }));

    ws.on("message", (msg) => {
      console.log("WS recv:", msg.toString());
    });

    ws.on("close", () => console.log("WS client disconnected"));
  });

  // Broadcast random percent every second
  const iv = setInterval(() => {
    const payload = JSON.stringify({
      percent: Math.round(Math.random() * 100),
    });
    wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) c.send(payload);
    });
  }, 1000);

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log("> WS endpoint: ws://localhost:" + PORT + "/api/ws");
  });

  process.on("SIGINT", () => {
    clearInterval(iv);
    wss.close();
    server.close(() => process.exit(0));
  });
});
