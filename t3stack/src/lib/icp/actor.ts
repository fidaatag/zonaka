// src/lib/icp/create-actor.ts
import { Actor, HttpAgent, type ActorSubclass, type Identity } from "@dfinity/agent";
import { idlFactory as baseFactory } from "./idl-factory";
// import { idlFactory as studentFactory } from "./idl-factory-student";
// import { idlFactory as schoolFactory } from "./idl-factory-school";
// import { idlFactory as predictFactory } from "./idl-factory-predict";
import { env } from "@/env";

type CanisterName = "base" | "student" | "school" | "predict";

/**
 * Universal actor creator usable both in server (SSR/tRPC) and client (React).
 */
export const createActor = async (
  canisterName: CanisterName = "base",
  identity?: Identity
): Promise<ActorSubclass<any>> => {
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

  const mapping: Record<CanisterName, { idlFactory: any; canisterId: string }> = {
    base: {
      idlFactory: baseFactory,
      canisterId: env.NEXT_PUBLIC_IC_CANISTER_ID,
    },
    student: {
      idlFactory: undefined,
      canisterId: ""
    },
    school: {
      idlFactory: undefined,
      canisterId: ""
    },
    predict: {
      idlFactory: undefined,
      canisterId: ""
    }
  };

  const { idlFactory, canisterId } = mapping[canisterName];

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
