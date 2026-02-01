import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 10000;

// Load video map
const videos = JSON.parse(fs.readFileSync("./videos.json", "utf8"));

// Serve frontend
app.use(express.static("public"));

// API Proxy to hide real video URL
app.get("/api/stream", async (req, res) => {
  const { id } = req.query;
  const video = videos[id];

  if (!video) {
    return res.status(404).send("Invalid video ID");
  }

  try {
    const response = await fetch(video.url, {
      headers: {
        Range: req.headers.range || ""
      }
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Stream error");
  }
});

app.listen(PORT, () => console.log(`🔐 Engineers Babu Player running on port ${PORT}`));
