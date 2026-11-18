import mongoose from "mongoose";
import { env } from "./env.js";
import dns from "node:dns";

export async function connectDatabase() {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  await mongoose.connect(env.MONGODB_URI);
  console.info("Connected to MongoDB.");
}
