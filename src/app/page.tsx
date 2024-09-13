import { LoginButton } from "@/components/auth/LoginButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Welcome to My App</h1>
      {session ? (
        <p>Signed in as {session.user?.email}</p>
      ) : (
        <p>Not signed in</p>
      )}
      <LoginButton />
    </div>
  );
}
