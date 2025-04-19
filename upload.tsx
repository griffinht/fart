import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { showRoutes } from "hono/dev";
import { mkdir } from "node:fs/promises";
import { serveStatic } from "hono/bun";

const app = new Hono();
const UPLOAD_COOLDOWN = 3000; // 3 seconds in milliseconds
let lastUploadTime = 0;

// Serve fart.mp3
app.get("/fart.mp3", serveStatic({ path: "uploads/fart.mp3" }));

// Add JSX renderer middleware
app.use(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <title>File Upload</title>
          <style>{`
          .upload-form {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .submit-btn {
            background: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
        </head>
        <body>{children}</body>
      </html>
    );
  })
);

// GET handler for the upload form page
app.get("/upload", (c) => {
  return c.render(
    <div class="upload-form">
      <h2>Upload Audio File</h2>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <div class="form-group">
          <label for="audio">Select audio file:</label>
          <input
            type="file"
            id="audio"
            name="audio"
            accept="audio/*"
            required
          />
        </div>
        <button type="submit" class="submit-btn">
          Upload
        </button>
      </form>
    </div>
  );
});

// POST handler for file upload
app.post("/upload", async (c) => {
  const now = Date.now();
  if (now - lastUploadTime < UPLOAD_COOLDOWN) {
    console.error("somebody is cheating the upload!");
    return c.json({ error: "Please wait 3 seconds between uploads" }, 400);
  }

  const file = await c.req.formData();
  const audio = file.get("audio");

  if (!audio || !(audio instanceof File)) {
    return c.json({ error: "No audio file provided" }, 400);
  }

  try {
    // Create uploads directory if it doesn't exist
    await mkdir("uploads", { recursive: true });

    console.log("upload fart.mp3");
    // Save the file as fart.mp3
    await Bun.write("uploads/fart.mp3", audio);
    lastUploadTime = now;

    // Redirect to the main page
    return c.redirect("/");
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to save file" }, 500);
  }
});

// For development: show all registered routes
showRoutes(app);

export default app;
