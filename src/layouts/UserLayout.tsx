import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingPage from "@/pages/LoadingPage";
import { Navigate, Outlet } from "react-router";

const UserLayout = () => {
  const { user, role, isPending } = useCurrentUser();

  // session load hocche, ekhon redirect kora jabe na
   if (isPending) {
     return <LoadingPage/>
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
    <div className="min-h-dvh lg:flex max-w-[1700px] mx-auto">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;