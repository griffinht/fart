import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./" }));

// Add JSX renderer middleware
app.use(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <title>Fart Sound</title>
          <style>{`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            gap: 20px;
          }
          .player {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        `}</style>
        </head>
        <body>{children}</body>
      </html>
    );
  })
);

import upload from "./upload";
app.route("/", upload);

app.get("/", (c) => {
  return c.render(
    <div class="container">
      <div class="player">
        <audio controls autoplay>
          <source src="/fart.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <countdown-button time="3">
        <button onclick="window.location.href='/upload'">Upload Audio</button>
      </countdown-button>
      <script src="/static/script.js"></script>
    </div>
  );
});

export default app;
