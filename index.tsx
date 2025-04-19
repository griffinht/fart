import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./" }));

// Add upload endpoint
app.post("/upload", async (c) => {
  const file = await c.req.formData();
  const audio = file.get("audio");

  if (!audio || !(audio instanceof File)) {
    return c.json({ error: "No audio file provided" }, 400);
  }

  // Save the file - you might want to add proper file handling here
  await Bun.write(`uploads/${audio.name}`, audio);

  return c.json({ success: true });
});

app.get("/", (c) => {
  return c.html(
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <countdown-button time="3">
        <button>test</button>
      </countdown-button>
      <script src="/static/script.js"></script>
    </div>
  );
});

export default app;
