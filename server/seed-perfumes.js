import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const uri = process.env.MONGODB_URI || process.env.MONGOD_DB;
const databaseName = process.env.MONGODB_DB_NAME || "scentbase";

const perfumes = JSON.parse(readFileSync(new URL("./perfumes.json", import.meta.url)));

const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db(databaseName).collection("perfumes");
  const result = await collection.insertMany(perfumes);
  console.log(`Inserted ${result.insertedCount} perfumes.`);
} finally {
  await client.close();
}