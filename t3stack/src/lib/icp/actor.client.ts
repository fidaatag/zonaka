"use client";

import { env } from "@/env";
import { Actor, HttpAgent, type Identity } from "@dfinity/agent";
import { idlFactory } from "./idl-factory";
import type { ActorIdlFactory } from "@/types/actor-factory";

const CANISTER_ID = env.NEXT_PUBLIC_IC_CANISTER_ID;

const createAgent = async (identity?: Identity) => {
  const agent = new HttpAgent({
    host: env.NEXT_PUBLIC_IC_HOST,
    identity,
  });

  // 🚀 Use process.env.NODE_ENV in client
  if (process.env.NODE_ENV !== "production") {
    await agent.fetchRootKey();
  }

  return agent;
};

export const createActor = async (identity?: Identity) => {
  const agent = await createAgent(identity);

  return Actor.createActor<ActorIdlFactory>(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
};
