import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/utils/db/client";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { config } from "dotenv";
import { accounts, chats, messages, sessions, users } from "@/utils/db/schema";
import { Adapter } from "next-auth/adapters";
config({ path: ".env.local" });

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    //@ts-ignore
    usersTable: users,
    //@ts-ignore
    accountsTable: accounts,
    //@ts-ignore
    sessionsTable: sessions,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        //@ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
