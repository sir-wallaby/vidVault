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
app.use(express.json({ limit: "100mb" }));

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
  
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});