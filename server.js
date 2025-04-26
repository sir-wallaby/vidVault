"use strict";

import dotenv from 'dotenv';
import express from 'express';
import pgPkg from 'pg';
import cors from 'cors';

dotenv.config(); // Load environment variables from .env

const { Client } = pgPkg;
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "500mb" }));

// Configure PostgreSQL connection using environment variables
const pgClient = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

pgClient.connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL:", error);
  });

app.post("/upload", async (req, res) => {
    try {
      let { fileName, fileType, fileData } = req.body;
      
      if (!fileName || !fileType || !fileData) {
        return res.status(400).json({ error: "Missing required file information" });
      }
  
      const prefixRegex = /^data:.*;base64,/;
      fileData = fileData.replace(prefixRegex, "");
  
      const fileBuffer = Buffer.from(fileData, "base64");
  
      const query = `
        INSERT INTO media_files (file_name, file_type, file_date)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
      const values = [fileName, fileType, fileBuffer];
      const result = await pgClient.query(query, values);
      
      return res.json({
        message: "File stored successfully",
        fileId: result.rows[0].id
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      return res.status(500).json({ error: "Error storing file" });
    }
  });

  // List all videos
app.get("/videos", async (req, res) => {
    try {
      const { rows } = await pgClient.query(`
        SELECT
          id,
          file_name AS name,
          file_type AS type,
          created_date AS uploadedAt
        FROM media_files
        ORDER BY created_date DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error("List videos error:", err);
      res.status(500).json({ error: "Could not list videos" });
    }
  });

  // Stream video by ID
app.get("/videos/:id/stream", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { rows } = await pgClient.query(
        `SELECT file_type, file_date FROM media_files WHERE id = $1`,
        [id]
      );
      if (!rows.length) {
        return res.status(404).send("Not found");
      }
      const { file_type, file_date } = rows[0];
      const buf = file_date;
      res.writeHead(200, {
        "Content-Type": file_type,
        "Content-Length": buf.length,
      });
      res.end(buf);
    } catch (err) {
      console.error("Stream error:", err);
      res.status(500).send("Stream failed");
    }
  });

  
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server listening on port ${PORT}`);
});