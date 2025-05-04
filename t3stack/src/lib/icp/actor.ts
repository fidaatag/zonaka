// src/lib/icp/create-actor.ts
import { Actor, HttpAgent, type Identity } from "@dfinity/agent";
import { idlFactory } from "./idl-factory";
import { env } from "@/env";

/**
 * Universal actor creator usable both in server (SSR/tRPC) and client (React).
 */
export const createActor = async (identity?: Identity) => {
  const agent = new HttpAgent({
    host: env.NEXT_PUBLIC_IC_HOST,
    identity,
  });

  // Only fetch root key in local/dev environments
  if (process.env.NODE_ENV !== "production") {
    // Prevent crash if running in server environment (no `window`)
    try {
      await agent.fetchRootKey();
    } catch (err) {
      console.warn("[ICP] fetchRootKey skipped (likely SSR):", err);
    }
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: env.NEXT_PUBLIC_IC_CANISTER_ID,
  });
};
