# OYI Media — backend

Express API with Prisma and MongoDB Atlas.

1. Create a free cluster in [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow your IP (or `0.0.0.0/0` for local dev).
3. Copy the connection string into `.env` as `DATABASE_URL`. Use database name `oyimedia`.

```bash
cd OYI-Media-Backend
cp .env.example .env
# paste your Atlas URI into DATABASE_URL
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)

Posts, influencers, services, and contacts live in Atlas. Uploaded images still go to the local `uploads/` folder (the database only stores the path).
