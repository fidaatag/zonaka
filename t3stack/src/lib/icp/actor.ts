import { env } from '@/env';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './idl-factory';

// Replace with your canister ID
const CANISTER_ID = env.IC_CANISTER_ID

// Create an HTTP agent to interact with the ICP mainnet
const agent = await HttpAgent.create({
  host: env.IC_HOST, // Mainnet host
});

// Remove this line in production to avoid fetching root key
if (env.NODE_ENV !== 'production') {
  agent.fetchRootKey();
}

// Create an actor to interact with the canister
export const createActor = (canisterId: string = CANISTER_ID) => {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

// Export a default actor instance
export const actor = createActor();