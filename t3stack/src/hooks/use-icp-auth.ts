"use client";

import { useEffect, useState, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor as createBackendActor } from "@/lib/icp/actor"; // 👈 ganti ke versi universal
import type { ActorSubclass, Identity } from "@dfinity/agent";
import { env } from "@/env"; // pastikan import env

export const useIcpAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<ActorSubclass<any> | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClientReady, setAuthClientReady] = useState(false); // 🚀 tambahan

  const initAuth = useCallback(async () => {
    const client = await AuthClient.create();
    const identity = client.getIdentity();
    const backendActor = await createBackendActor("base", identity);
    const authenticated = await client.isAuthenticated();

    setAuthClient(client);
    setActor(backendActor);
    setIsAuthenticated(authenticated);
    setAuthClientReady(true);

    if (authenticated) {
      const principalId = identity.getPrincipal().toString();
      setPrincipal(principalId);
    } else {
      setPrincipal(null);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async () => {
    if (!authClient) {
      console.warn("AuthClient belum siap");
      return;
    }

    await authClient.login({
      identityProvider: `http://${env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`,
      onSuccess: initAuth,
    });
  }, [authClient, initAuth]);

  const logout = useCallback(async () => {
    if (!authClient) {
      console.warn("AuthClient belum siap");
      return;
    }

    await authClient.logout();
    await initAuth();
  }, [authClient, initAuth]);

  const whoami = useCallback(async () => {
    if (!actor) {
      console.warn("Actor belum siap");
      return;
    }

    try {
      const result = await actor.whoami();
      const principalId = result.toString();
      setPrincipal(principalId);
    } catch (error) {
      console.error("Failed to fetch whoami:", error);
    }
  }, [actor]);

  return {
    login,
    logout,
    whoami,
    principal,
    isAuthenticated,
    actor,
    authClientReady, // 🚀 tambahan
  };
};
