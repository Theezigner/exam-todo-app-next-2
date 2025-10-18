import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GooglePrivider from "next-auth/providers/google";

export const {auth, handlers, signIn, signOut} = NextAuth({
  providers: [
    GitHub,
    GooglePrivider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
],
secret: process.env.SECRET,
});