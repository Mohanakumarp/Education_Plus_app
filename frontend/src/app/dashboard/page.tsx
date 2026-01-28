import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name}</h1>
      <p className="text-muted-foreground">
        This is your dashboard. Navigate to your subjects, tasks, or study tools.
      </p>
      <div className="mt-4">
        <p>Email: {session.user?.email}</p>
        <p>Role: {session.user?.role}</p>
      </div>
    </div>
  );
}
