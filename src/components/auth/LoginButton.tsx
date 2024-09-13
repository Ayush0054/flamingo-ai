"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline">
        Sign out
      </Button>
    );
  }
  return (
    <Button onClick={() => signIn("google")} variant="default">
      Sign in with Google
    </Button>
  );
}
