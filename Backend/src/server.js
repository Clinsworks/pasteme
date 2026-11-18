import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import app from "./app.js";

await connectDatabase();

const server = app.listen(env.PORT, () => {
  console.info(`PasteMe API listening on port ${env.PORT}.`);
});

async function shutdown(signal) {
  console.info(`${signal} received. Closing the API server.`);
  server.close(async (error) => {
    if (error) {
      console.error("Could not close the API server cleanly:", error);
      process.exitCode = 1;
    }
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
