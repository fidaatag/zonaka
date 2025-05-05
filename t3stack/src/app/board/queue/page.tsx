'use client'

import CardListQueue from "@/components/card-list-queue"
import { Button } from "@/components/ui/button"
import { useIcpAuth } from "@/hooks/use-icp-auth"
import { useState } from "react"

export default function PageQueue() {
  const {
    login,
    logout,
    whoami,
    principal,
    isAuthenticated,
    authClientReady,
    authClient
  } = useIcpAuth()

  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
      {/* Komponen 2 - Connect ICP */}
      <div className="order-1 md:order-2 border border-red-500 rounded-lg p-4 space-y-4">
        {!isAuthenticated ? (
          <Button onClick={login} disabled={!authClientReady} className="w-full">
            {authClientReady ? "Connect to Internet Identity" : "Loading ICP..."}
          </Button>
        ) : (
          <>
            <Button onClick={logout} className="w-full">
              Disconnect ICP
            </Button>
            <Button onClick={whoami} disabled={!isAuthenticated} className="w-full">
              Who Am I on ICP?
            </Button>
            {principal && (
              <div className="mt-4 break-words text-sm font-mono">
                <div className="font-semibold">ICP Principal:</div>
                <div>{principal}</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Komponen 1 - Card List Queue */}
      <div className="order-2 md:order-1 rounded-lg">
        <CardListQueue principal={principal!} identity={authClient?.getIdentity()}/>
      </div>
    </div>
  )
}
