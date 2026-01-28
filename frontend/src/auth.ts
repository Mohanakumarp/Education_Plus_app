import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectDB();
        
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
            return null;
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
          throw new Error("Invalid password.");
        }

        return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name, 
            image: user.image, 
            role: user.role 
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
