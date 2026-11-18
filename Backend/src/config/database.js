import mongoose from "mongoose";
import { env } from "./env.js";
import dns from "node:dns";

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2 && connectionPromise) return connectionPromise;

  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  connectionPromise = mongoose.connect(env.MONGODB_URI)
    .then(() => {
      console.info("Connected to MongoDB.");
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
}
