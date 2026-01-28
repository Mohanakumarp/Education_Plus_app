import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findOne({ email: session.user?.email }).lean();

  if (!user) {
      return <div>User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <ProfileForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
