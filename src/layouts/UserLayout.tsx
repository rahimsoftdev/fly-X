import type { IUser } from "@/types/user.type";
import { getCurrentUser } from "@/utils/auth.util";
import { Navigate } from "react-router";


const UserLayout = () => {

    const user: IUser | null = getCurrentUser()
    console.log(user)

    if (user?.role !== 'user') {
        return <Navigate to="/login" replace />;
    }
    return (
        <div>
            <h1>thsi si user layout</h1>
        </div>
    );
};

export default UserLayout;