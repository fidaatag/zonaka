"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SignInbutton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button size="sm" onClick={() => signIn("google")}>
        <p> Sign in with Google </p>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{session.user.name ?? ""}</span>
        <span className="truncate text-xs">{session.user.email ?? ""}</span>
      </div>
    </div>
  );
}
