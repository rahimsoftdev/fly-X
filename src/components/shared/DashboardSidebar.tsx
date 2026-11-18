import { adminNavigation, staffNavigation, userNavigation } from '@/data/dashbaord.data';
import type { IUser } from '@/types/user.type';
import { getCurrentUser } from '@/utils/auth.util';
import { useState } from 'react';


const DashboardSidebar = () => {


    const currentUser: IUser | null = getCurrentUser()

    //link will be base on current user role:
    const links =
        currentUser?.role === 'admin'
            ? adminNavigation
            : currentUser?.role === 'staff'
                ? staffNavigation
                : currentUser?.role === 'user'
                    ? userNavigation
                    : [];

    // console.log(currentUser)
    return (
        <div>
            <h1>thsi si</h1>
        </div>
    );
};

export default DashboardSidebar;