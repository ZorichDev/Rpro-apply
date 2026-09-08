import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env";

// Some networks can't resolve mongodb+srv:// SRV records through their
// default DNS, even though the Atlas cluster itself is reachable — this
// forces Node to use Google/Cloudflare's DNS for that lookup instead.
// Harmless no-op on networks that don't have this problem.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error("[db] connection failed", err);
    process.exit(1);
  }
}
