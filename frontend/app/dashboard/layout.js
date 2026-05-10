import DashboardShell from "@/components/layout/DashboardShell";
import Protected from "@/components/auth/Protected";

export default function DashboardLayout({ children }) {
  return (
    <Protected access="dashboard">
      <DashboardShell>{children}</DashboardShell>
    </Protected>
  );
}
