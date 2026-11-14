import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import PublicLayout from '@/layouts/PublicLayout'
import StaffLayout from '@/layouts/StaffLayout'
import UserLayout from '@/layouts/UserLayout'
import ContactPage from '@/pages/public/ContactPage'
import HomePage from '@/pages/public/HomePage'
import { createBrowserRouter } from 'react-router'

const router = createBrowserRouter([
    //public page routes:
    {
        path: "",
        Component: PublicLayout,
        children: [
            {
                index: true, Component: HomePage
            },
            {
                path: "contact", Component: ContactPage
            }
        ]
    },

    //auth page routes:
    {
        path: "", Component: AuthLayout
    },

    //admin dashboard page routes:
    {
        path: 'admin',
        Component: AdminLayout
    },


    //user dashboard page routes:
    {
        path: 'user',
        Component: UserLayout
    },


    //staff dashboard page routes:
    {
        path: 'staff',
        Component: StaffLayout
    },


])

export default router