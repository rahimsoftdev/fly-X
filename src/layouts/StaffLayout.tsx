import DashboardSidebar from "@/components/shared/DashboardSidebar";
import type { IUser } from "@/types/user.type";
import { getCurrentUser } from "@/utils/auth.util";
import { Navigate, Outlet } from "react-router";


const StaffLayout = () => {

    const user: IUser | null = getCurrentUser()
    console.log(user)

    if (user?.role !== 'staff') {
        return <Navigate to="/login" replace />;
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

export default StaffLayout;