import type { IUser } from "@/types/user.type";
import { getCurrentUser } from "@/utils/auth.util";
import { Navigate } from "react-router";


const StaffLayout = () => {

    const user: IUser | null = getCurrentUser()
    console.log(user)

    if (user?.role !== 'staff') {
        return <Navigate to="/login" replace />;
    }
    return (
        <div>
            <h1>this si staf layout</h1>
        </div>
    );
};

export default StaffLayout;