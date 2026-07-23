import crypto from "crypto";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const uri = process.env.MONGODB_URI || process.env.MONGOD_DB;
const databaseName = process.env.MONGODB_DB_NAME || "scentbase";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!uri || !email || !password) {
  throw new Error("Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD before running this script.");
}

const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
const client = new MongoClient(uri);

try {
  await client.connect();
  const users = client.db(databaseName).collection("users");
  const result = await users.updateOne(
    { email },
    {
      $set: {
        name: "Administrator",
        passwordHash,
        role: "admin",
        updatedAt: new Date(),
      },
      $setOnInsert: { email, createdAt: new Date() },
    },
    { upsert: true },
  );

  console.log(result.upsertedCount ? "Admin account created." : "Admin account updated.");
} finally {
  await client.close();
}
