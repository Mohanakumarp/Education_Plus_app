import { Suspense } from "react";
import DashboardLayoutWrapper from "@/components/layout/dashboard-layout-wrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function AuthCheck() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </>
  );
}

