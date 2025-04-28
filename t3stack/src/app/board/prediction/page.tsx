"use client";

import { Button } from "@/components/ui/button";
import { useIcpAuth } from "@/hooks/use-icp-auth";

export default function PredictionPage() {
  const { login, logout, whoami, principal, isAuthenticated, authClientReady } = useIcpAuth();

  return (
    <div className="p-4 space-y-4">

      {/* ICP Auth Section */}
      {!isAuthenticated ? (
        <Button onClick={login} disabled={!authClientReady}>
          {authClientReady ? "Connect to Internet Identity" : "Loading ICP..."}
        </Button>
      ) : (
        <Button onClick={logout}>
          Disconnect ICP
        </Button>
      )}

      <Button onClick={whoami} disabled={!isAuthenticated}>
        Who Am I on ICP?
      </Button>

      {principal && (
        <div className="mt-4">
          <div>Your ICP Principal ID:</div>
          <div className="font-mono text-sm">{principal}</div>
        </div>
      )}
    </div>
  );
}
