"use client"; // ⬅️ HARUS di atas sendiri!


import { env } from '@/env';
import { Actor, HttpAgent, type Identity } from '@dfinity/agent';
import { idlFactory } from './idl-factory';

// Replace with your canister ID
const CANISTER_ID = env.NEXT_PUBLIC_IC_CANISTER_ID;

let agent: HttpAgent | null = null;

/**
 * Initialize the HTTP agent to interact with the ICP network.
 * Wrap in try-catch to gracefully handle connection errors.
 */
async function initAgent() {
  try {
    agent = await HttpAgent.create({
      host: env.NEXT_PUBLIC_IC_HOST, // Mainnet or local replica host
    });

    // Remove this line in production to avoid fetching the root key
    if (env.NODE_ENV !== 'production') {
      await agent.fetchRootKey();
    }
  } catch (error) {
    console.error('Failed to initialize HTTP agent:', error);
    agent = null; // Mark agent as unavailable
  }
}

// Call the agent initialization
await initAgent();

/**
 * Create an actor to interact with the canister.
 * Throws an error if the agent is not available.
 */
export const createActor = async (identity?: Identity) => {

  const actorAgent = identity
    ? await HttpAgent.create({ host: env.NEXT_PUBLIC_IC_HOST, identity })
    : agent;

  if (!actorAgent) {
    throw new Error('Agent is not initialized. Cannot create actor.');
  }

  // If creating a new agent with identity in dev, fetch root key again
  if (identity && env.NODE_ENV !== 'production') {
    actorAgent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent: actorAgent,
    canisterId: CANISTER_ID,
  });
};

// Export a default actor instance if agent is successfully created
export const actor = agent ? createActor() : null;