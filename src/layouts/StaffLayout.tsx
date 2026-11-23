import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Navigate, Outlet } from "react-router";

const StaffLayout = () => {
  const { user, role, isPending } = useCurrentUser();

  // session load hocche, ekhon redirect kora jabe na
  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-(--paragraph-text)">
        Loading...
      </div>
    );
  }

  // login kora nai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // login ache kintu staff na -> nijer dashboard e pathao
  if (role !== "staff") {
    return <Navigate to={`/${role}`} replace />;
  }

  return (
    <div className="min-h-dvh lg:flex max-w-[1700px] mx-auto">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;