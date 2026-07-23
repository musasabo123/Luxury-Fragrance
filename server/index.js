import http from "http";
import url from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: new URL("../.env", import.meta.url) });

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOD_DB;
const DATABASE_NAME = process.env.MONGODB_DB_NAME || "scentbase";

if (!MONGODB_URI) {
  console.error(
    "Missing MongoDB connection string. Set MONGODB_URI or MONGOD_DB in .env.",
  );
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body) return resolve(null);
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

let usersCollection;
let perfumesCollection;
async function connectToMongo() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);
  usersCollection = db.collection("users");
  perfumesCollection = db.collection("perfumes");
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  console.log(`Connected to MongoDB database '${DATABASE_NAME}'`);
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname || "/";

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    return res.end();
  }

  try {
    if (req.method === "GET" && path === "/api/health") {
      res.writeHead(200, headers);
      return res.end(JSON.stringify({ status: "ok" }));
    }

    if (req.method === "GET" && path === "/api/perfumes") {
      const perfumes = await perfumesCollection
        .find({})
        .sort({ name: 1 }) // Sort A-Z
        .limit(20) // Return only 20 perfumes
        .toArray();

      res.writeHead(200, headers);
      return res.end(JSON.stringify(perfumes));
    }

    if (req.method === "POST" && path === "/api/signup") {
      const body = await parseJSONBody(req);
      if (!body || !body.email || !body.password || !body.name) {
        res.writeHead(400, headers);
        return res.end(
          JSON.stringify({ error: "name, email and password required" }),
        );
      }
      const email = String(body.email).toLowerCase();
      const pwHash = hashPassword(body.password);
      try {
        const result = await usersCollection.insertOne({
          name: String(body.name),
          email,
          passwordHash: pwHash,
          role: "user",
          createdAt: new Date(),
        });
        res.writeHead(201, headers);
        return res.end(
          JSON.stringify({ ok: true, email, name: String(body.name) }),
        );
      } catch (error) {
        if (error?.code === 11000) {
          res.writeHead(409, headers);
          return res.end(JSON.stringify({ error: "user_already_exists" }));
        }
        throw error;
      }
    }

    if (req.method === "POST" && path === "/api/login") {
      const body = await parseJSONBody(req);
      if (!body || !body.email || !body.password) {
        res.writeHead(400, headers);
        return res.end(
          JSON.stringify({ error: "email and password required" }),
        );
      }
      const email = String(body.email).toLowerCase();
      const user = await usersCollection.findOne({ email });
      if (!user) {
        res.writeHead(401, headers);
        return res.end(JSON.stringify({ error: "invalid_credentials" }));
      }
      const pwHash = hashPassword(body.password);
      if (pwHash !== user.passwordHash) {
        res.writeHead(401, headers);
        return res.end(JSON.stringify({ error: "invalid_credentials" }));
      }
      res.writeHead(200, headers);
      return res.end(JSON.stringify({ ok: true, email, name: user.name, role: user.role || "user" }));
    }

    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: "server_error", message: String(err) }));
  }
});

async function start() {
  await connectToMongo();
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
