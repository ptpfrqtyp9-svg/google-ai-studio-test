import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import JSZip from "jszip";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    engine: "CoreGraphics Geometric Stroke Analyzer",
  });
});

// Direct individual Swift file download endpoint
app.get("/swift/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(process.cwd(), "public", "swift", safeFilename);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    return res.sendFile(filePath);
  }
  return res.status(404).send("File not found");
});

// Download Swift project files as standard .zip (compatible with Apple Archive Utility and iPadOS)
app.get(["/api/download-swift-files", "/api/download-swift-playground"], async (_req, res) => {
  try {
    const staticZipPath = path.join(process.cwd(), "public", "SwiftFiles.zip");
    if (fs.existsSync(staticZipPath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="SwiftFiles.zip"');
      return fs.createReadStream(staticZipPath).pipe(res);
    }

    // Dynamic fallback generation
    const zip = new JSZip();
    const playgroundDir = path.join(process.cwd(), "SwiftPlayground");

    function addFiles(dirPath: string, prefix = "") {
      if (!fs.existsSync(dirPath)) return;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          addFiles(fullPath, `${prefix}${entry.name}/`);
        } else {
          const content = fs.readFileSync(fullPath);
          // Add at root if it's in Sources or top-level
          zip.file(`${prefix}${entry.name}`, content);
          if (prefix.startsWith("Sources/")) {
            zip.file(entry.name, content);
          }
        }
      }
    }

    addFiles(playgroundDir);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
      platform: "UNIX",
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="SwiftFiles.zip"');
    return res.send(zipBuffer);
  } catch (err: any) {
    console.error("Failed to generate Swift files zip:", err);
    return res.status(500).json({ error: "Failed to create Swift files archive", details: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DrawCoach server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
