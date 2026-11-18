import type { IUser } from "@/types/user.type";
import { getCurrentUser } from "@/utils/auth.util";
import { Navigate } from "react-router";


const AdminLayout = () => {
    const user: IUser | null = getCurrentUser()
    console.log(user)

    if (user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return (
        <div>
            <h1>this is admin layout</h1>
        </div>
    );
};

export default AdminLayout;