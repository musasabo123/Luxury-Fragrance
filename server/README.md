This is a minimal Node HTTP server used for development and testing.

Configuration:
- Place your MongoDB connection string in `.env` as `MONGODB_URI` or `MONGOD_DB`
- Optionally set `MONGODB_DB_NAME` to choose the database name (defaults to `scentbase`)

Endpoints:
- GET /api/health -> { status: 'ok' }
- POST /api/signup -> { name, email, password }
- POST /api/login -> { email, password }

Notes:
- Users are persisted in MongoDB in the `users` collection.
- Passwords are hashed using SHA-256 (for development only; switch to a stronger scheme in production).

Run:

```bash
node server/index.js
```

The server listens on port 4000 by default (set PORT env to change).
