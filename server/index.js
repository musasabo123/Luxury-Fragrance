import http from "http";
import url from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
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
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
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

function parsePath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts;
}

// ─── Collections ─────────────────────────────────────────────
let usersCollection;
let perfumesCollection;
let reviewsCollection;
let feedbackCollection;
let activitiesCollection;
let favoritesCollection;

async function connectToMongo() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);
  usersCollection = db.collection("users");
  perfumesCollection = db.collection("perfumes");
  reviewsCollection = db.collection("reviews");
  feedbackCollection = db.collection("feedback");
  activitiesCollection = db.collection("activities");
  favoritesCollection = db.collection("favorites");

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await activitiesCollection.createIndex({ createdAt: -1 });
  await activitiesCollection.createIndex({ userId: 1 });
  await feedbackCollection.createIndex({ createdAt: -1 });
  await reviewsCollection.createIndex({ createdAt: -1 });
  await reviewsCollection.createIndex({ fragranceId: 1 });
  await favoritesCollection.createIndex({ userId: 1, fragranceId: 1 }, { unique: true });

  console.log(`Connected to MongoDB database '${DATABASE_NAME}'`);
}

// ─── Activity Logger ─────────────────────────────────────────
async function logActivity({ userId, username, type, description, ip, userAgent }) {
  try {
    const record = {
      userId: userId || null,
      username: username || "Anonymous",
      type,
      description: description || "",
      ip: ip || "",
      userAgent: userAgent || "",
      createdAt: new Date(),
    };
    await activitiesCollection.insertOne(record);
    return record;
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// ─── Route Handler ───────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || "/";
  const parts = parsePath(pathname);
  const method = req.method;
  const query = parsed.query || {};

  // Helper to write JSON response
  const json = (status, data) => {
    res.writeHead(status, headers);
    res.end(JSON.stringify(data));
  };

  if (method === "OPTIONS") {
    res.writeHead(204, headers);
    return res.end();
  }

  try {
    // ========================
    // HEALTH
    // ========================
    if (method === "GET" && pathname === "/api/health") {
      return json(200, { status: "ok" });
    }

    // ========================
    // PERFUMES
    // ========================
    if (method === "GET" && pathname === "/api/perfumes") {
      const perfumes = await perfumesCollection
        .find({})
        .sort({ name: 1 })
        .limit(20)
        .toArray();
      return json(200, perfumes);
    }

    // ========================
    // SIGNUP
    // ========================
    if (method === "POST" && pathname === "/api/signup") {
      const body = await parseJSONBody(req);
      if (!body || !body.email || !body.password || !body.name) {
        return json(400, { error: "name, email and password required" });
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
          updatedAt: new Date(),
        });

        // Log registration activity
        await logActivity({
          userId: String(result.insertedId),
          username: String(body.name),
          type: "registration",
          description: "User registered a new account",
          ip: req.socket.remoteAddress,
          userAgent: req.headers["user-agent"],
        });

        return json(201, { ok: true, email, name: String(body.name), id: String(result.insertedId) });
      } catch (error) {
        if (error?.code === 11000) {
          return json(409, { error: "user_already_exists" });
        }
        throw error;
      }
    }

    // ========================
    // LOGIN
    // ========================
    if (method === "POST" && pathname === "/api/login") {
      const body = await parseJSONBody(req);
      if (!body || !body.email || !body.password) {
        return json(400, { error: "email and password required" });
      }
      const email = String(body.email).toLowerCase();
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return json(401, { error: "invalid_credentials" });
      }
      const pwHash = hashPassword(body.password);
      if (pwHash !== user.passwordHash) {
        return json(401, { error: "invalid_credentials" });
      }

      // Log login activity
      await logActivity({
        userId: String(user._id),
        username: user.name,
        type: "login",
        description: "User logged in",
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(200, { ok: true, email, name: user.name, role: user.role || "user", id: String(user._id) });
    }

    // ========================
    // LOGOUT
    // ========================
    if (method === "POST" && pathname === "/api/logout") {
      const body = await parseJSONBody(req);
      if (body && body.userId) {
        await logActivity({
          userId: body.userId,
          username: body.username || "Unknown",
          type: "logout",
          description: "User logged out",
          ip: req.socket.remoteAddress,
          userAgent: req.headers["user-agent"],
        });
      }
      return json(200, { ok: true });
    }

    // ========================
    // ACTIVITY - General purpose log
    // ========================
    if (method === "POST" && pathname === "/api/activity") {
      const body = await parseJSONBody(req);
      if (!body || !body.type) {
        return json(400, { error: "type is required" });
      }
      await logActivity({
        userId: body.userId || null,
        username: body.username || "Anonymous",
        type: body.type,
        description: body.description || "",
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
      return json(201, { ok: true });
    }

    // ========================
    // ADMIN: DASHBOARD STATS
    // ========================
    if (method === "GET" && pathname === "/api/admin/stats") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalUsers = await usersCollection.countDocuments();
      const activeUsers = await activitiesCollection.distinct("userId", {
        createdAt: { $gte: thirtyDaysAgo },
        userId: { $ne: null },
      });
      const totalReviews = await reviewsCollection.countDocuments();
      const totalFeedback = await feedbackCollection.countDocuments();
      const totalSearches = await activitiesCollection.countDocuments({
        type: "search",
      });
      const totalFragrances = await perfumesCollection.countDocuments();
      const totalFavorites = await favoritesCollection.countDocuments();

      // Trends (compare last 7 days vs previous 7 days)
      const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prev14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const usersLast7 = await usersCollection.countDocuments({ createdAt: { $gte: last7 } });
      const usersPrev7 = await usersCollection.countDocuments({ createdAt: { $gte: prev14, $lt: last7 } });

      const reviewsLast7 = await reviewsCollection.countDocuments({ createdAt: { $gte: last7 } });
      const reviewsPrev7 = await reviewsCollection.countDocuments({ createdAt: { $gte: prev14, $lt: last7 } });

      const feedbackLast7 = await feedbackCollection.countDocuments({ createdAt: { $gte: last7 } });
      const feedbackPrev7 = await feedbackCollection.countDocuments({ createdAt: { $gte: prev14, $lt: last7 } });

      const searchesLast7 = await activitiesCollection.countDocuments({ type: "search", createdAt: { $gte: last7 } });
      const searchesPrev7 = await activitiesCollection.countDocuments({ type: "search", createdAt: { $gte: prev14, $lt: last7 } });

      const calcTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const pct = ((current - previous) / previous) * 100;
        return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
      };

      // Average rating
      const avgRatingResult = await reviewsCollection.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]).toArray();
      const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avg : 0;

      // Recent new users count this week
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newUsersThisWeek = await usersCollection.countDocuments({ createdAt: { $gte: weekStart } });

      // Pending feedback count
      const pendingFeedback = await feedbackCollection.countDocuments({ status: "pending" });

      return json(200, {
        totalUsers,
        activeUsers: activeUsers.length,
        totalReviews,
        totalFeedback,
        totalSearches,
        totalFragrances,
        totalFavorites,
        avgRating: Math.round(avgRating * 10) / 10,
        newUsersThisWeek,
        pendingFeedback,
        trends: {
          users: { value: usersLast7, percentage: calcTrend(usersLast7, usersPrev7) },
          reviews: { value: reviewsLast7, percentage: calcTrend(reviewsLast7, reviewsPrev7) },
          feedback: { value: feedbackLast7, percentage: calcTrend(feedbackLast7, feedbackPrev7) },
          searches: { value: searchesLast7, percentage: calcTrend(searchesLast7, searchesPrev7) },
        },
      });
    }

    // ========================
    // ADMIN: RECENT ACTIVITIES
    // ========================
    if (method === "GET" && pathname === "/api/admin/activities") {
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const activities = await activitiesCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return json(200, activities);
    }

    // ========================
    // ADMIN: RECENT FEEDBACK
    // ========================
    if (method === "GET" && pathname === "/api/admin/feedback") {
      const limit = Math.min(parseInt(query.limit) || 10, 50);
      const feedback = await feedbackCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return json(200, feedback.map(f => ({ ...f, id: String(f._id) })));
    }

    // ========================
    // REVIEWS
    // ========================
    if (method === "POST" && pathname === "/api/reviews") {
      const body = await parseJSONBody(req);
      if (!body || !body.userId || !body.fragranceId || !body.rating) {
        return json(400, { error: "userId, fragranceId, and rating are required" });
      }
      const review = {
        userId: body.userId,
        username: body.username || "Anonymous",
        fragranceId: body.fragranceId,
        fragranceName: body.fragranceName || "",
        rating: Math.min(5, Math.max(1, body.rating)),
        title: body.title || "",
        body: body.body || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await reviewsCollection.insertOne(review);

      await logActivity({
        userId: body.userId,
        username: body.username || "Anonymous",
        type: "submit_review",
        description: `Reviewed "${body.fragranceName || fragranceId}" (${review.rating}/5)`,
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(201, { ...review, id: String(result.insertedId) });
    }

    if (method === "PUT" && parts.length === 4 && parts[0] === "api" && parts[1] === "reviews") {
      const reviewId = parts[2];
      const body = await parseJSONBody(req);
      if (!body) return json(400, { error: "body required" });

      const update = {};
      if (body.rating) update.rating = Math.min(5, Math.max(1, body.rating));
      if (body.title !== undefined) update.title = body.title;
      if (body.body !== undefined) update.body = body.body;
      update.updatedAt = new Date();

      const result = await reviewsCollection.findOneAndUpdate(
        { _id: new ObjectId(reviewId) },
        { $set: update },
        { returnDocument: "after" },
      );

      if (!result) return json(404, { error: "review not found" });

      await logActivity({
        userId: body.userId,
        username: body.username || "Unknown",
        type: "edit_review",
        description: `Edited their review`,
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(200, { ...result, id: String(result._id) });
    }

    if (method === "DELETE" && parts.length === 4 && parts[0] === "api" && parts[1] === "reviews") {
      const reviewId = parts[2];
      const body = await parseJSONBody(req);
      const review = await reviewsCollection.findOne({ _id: new ObjectId(reviewId) });
      if (!review) return json(404, { error: "review not found" });

      await reviewsCollection.deleteOne({ _id: new ObjectId(reviewId) });

      await logActivity({
        userId: body?.userId,
        username: body?.username || "Unknown",
        type: "delete_review",
        description: `Deleted their review of "${review.fragranceName || "a fragrance"}"`,
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(200, { ok: true });
    }

    // ========================
    // FEEDBACK
    // ========================
    if (method === "POST" && pathname === "/api/feedback") {
      const body = await parseJSONBody(req);
      if (!body || !body.message) {
        return json(400, { error: "message is required" });
      }
      const feedback = {
        userId: body.userId || null,
        username: body.username || "Anonymous",
        email: body.email || "",
        subject: body.subject || "",
        message: body.message,
        status: "pending",
        createdAt: new Date(),
      };
      const result = await feedbackCollection.insertOne(feedback);

      await logActivity({
        userId: body.userId,
        username: body.username || "Anonymous",
        type: "submit_feedback",
        description: `Submitted feedback: "${body.subject || "General"}"`,
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(201, { ...feedback, id: String(result.insertedId) });
    }

    // ========================
    // FAVORITES
    // ========================
    if (method === "POST" && pathname === "/api/favorites") {
      const body = await parseJSONBody(req);
      if (!body || !body.userId || !body.fragranceId) {
        return json(400, { error: "userId and fragranceId required" });
      }
      try {
        await favoritesCollection.insertOne({
          userId: body.userId,
          fragranceId: body.fragranceId,
          fragranceName: body.fragranceName || "",
          createdAt: new Date(),
        });

        await logActivity({
          userId: body.userId,
          username: body.username || "Unknown",
          type: "add_favorite",
          description: `Added "${body.fragranceName || body.fragranceId}" to favorites`,
          ip: req.socket.remoteAddress,
          userAgent: req.headers["user-agent"],
        });

        return json(201, { ok: true });
      } catch (err) {
        if (err?.code === 11000) return json(409, { error: "already_favorited" });
        throw err;
      }
    }

    if (method === "DELETE" && pathname === "/api/favorites") {
      const body = await parseJSONBody(req);
      if (!body || !body.userId || !body.fragranceId) {
        return json(400, { error: "userId and fragranceId required" });
      }
      await favoritesCollection.deleteOne({
        userId: body.userId,
        fragranceId: body.fragranceId,
      });

      await logActivity({
        userId: body.userId,
        username: body.username || "Unknown",
        type: "remove_favorite",
        description: `Removed "${body.fragranceName || body.fragranceId}" from favorites`,
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      return json(200, { ok: true });
    }

    // ========================
    // USER PROFILE
    // ========================
    if (method === "GET" && parts.length === 3 && parts[0] === "api" && parts[1] === "users") {
      const userId = parts[2];
      let user;
      try {
        user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      } catch {
        user = await usersCollection.findOne({ email: userId });
      }
      if (!user) return json(404, { error: "user not found" });
      const { passwordHash, ...safeUser } = user;
      return json(200, { ...safeUser, id: String(safeUser._id) });
    }

    if (method === "PUT" && parts.length === 5 && parts[0] === "api" && parts[1] === "users" && parts[3] === "profile") {
      const userId = parts[2];
      const body = await parseJSONBody(req);
      if (!body) return json(400, { error: "body required" });
      const update = {};
      if (body.name) update.name = body.name;
      if (body.bio !== undefined) update.bio = body.bio;
      if (body.avatar !== undefined) update.avatar = body.avatar;
      update.updatedAt = new Date();

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: update },
        { returnDocument: "after" },
      );
      if (!result) return json(404, { error: "user not found" });

      await logActivity({
        userId,
        username: body.username || result.name,
        type: "update_profile",
        description: "Updated their profile",
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      const { passwordHash, ...safeUser } = result;
      return json(200, { ...safeUser, id: String(safeUser._id) });
    }

    if (method === "PUT" && parts.length === 5 && parts[0] === "api" && parts[1] === "users" && parts[3] === "settings") {
      const userId = parts[2];
      const body = await parseJSONBody(req);
      if (!body) return json(400, { error: "body required" });
      const update = {};
      if (body.notifications !== undefined) update["settings.notifications"] = body.notifications;
      if (body.theme !== undefined) update["settings.theme"] = body.theme;
      if (body.language !== undefined) update["settings.language"] = body.language;
      update.updatedAt = new Date();

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: update },
        { returnDocument: "after" },
      );
      if (!result) return json(404, { error: "user not found" });

      await logActivity({
        userId,
        username: body.username || result.name,
        type: "change_settings",
        description: "Changed account settings",
        ip: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      const { passwordHash, ...safeUser } = result;
      return json(200, { ...safeUser, id: String(safeUser._id) });
    }

    // ========================
    // 404 FALLBACK
    // ========================
    return json(404, { error: "not_found" });
  } catch (err) {
    console.error("Server error:", err);
    return json(500, { error: "server_error", message: String(err) });
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

