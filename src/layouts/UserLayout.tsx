import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Navigate, Outlet } from "react-router";

const UserLayout = () => {
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

  // login ache kintu role alada (admin/staff) -> nijer dashboard e pathao
  if (role !== "user") {
    return <Navigate to={`/${role}`} replace />;
  }

  return (
    <div className="min-h-dvh lg:flex">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;