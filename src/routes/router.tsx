import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import PublicLayout from '@/layouts/PublicLayout'
import StaffLayout from '@/layouts/StaffLayout'
import UserLayout from '@/layouts/UserLayout'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ContactPage from '@/pages/public/ContactPage'
import FaqPage from '@/pages/public/FaqPage'
import HomePage from '@/pages/public/HomePage'
import MembershipPage from '@/pages/public/MembershipPage'
import TermsAndConditionsPage from '@/pages/public/TermsAndConditions'
import CustomTravelCalendarPage from '@/pages/staff/CustomTravelCalendarPage'
import CustomTravelDayPage from '@/pages/staff/CustomTravelDayPage'
import MemberInterestDetailsPage from '@/pages/staff/MemberInterestDetailsPage'
import MembersInterestPage from '@/pages/staff/MembersInterestPage'
import StaffOverviewPage from '@/pages/staff/StaffOverviewPage'
// import MemberInterestDetailsPage from '@/pages/staff/MembersInterestPage'
import MyCustomTravelsPage from '@/pages/users/MyCustomTravelsPage'
import NewTravelRequestPage from '@/pages/users/NewTravelRequestPage'
import OpportunitiesPage from '@/pages/users/OpportunitiesPage'
import PendingReservationsPage from '@/pages/users/PendingReservationsPage'
import TravelPreferencesPage from '@/pages/users/TravelPreferencesPage'
import UpcomingTripsPage from '@/pages/users/UpcomingTripsPage'
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
                path: "membership", Component: MembershipPage
            },
            {
                path: "contact", Component: ContactPage
            },
            {
                path: 'faq', Component: FaqPage
            },
            {
                path: 'terms', Component: TermsAndConditionsPage
            },
        ]
    },

    //auth page routes:
    {
        path: "", Component: AuthLayout,
        children: [
            {
                path: "login", Component: LoginPage
            },
            {
                path: "register", Component: RegisterPage
            },
        ]
    },

    //admin dashboard page routes:
    {
        path: 'admin',
        Component: AdminLayout
    },


    //user dashboard page routes:
    {
        path: 'user',
        Component: UserLayout,
        children: [
            {
                path: "travel-opportunities", Component: OpportunitiesPage
            },
            {
                path: "pending-reservations", Component: PendingReservationsPage
            },
            {
                path: "upcoming-trips", Component: UpcomingTripsPage
            },
            {
                path: "travel-preferences", Component: TravelPreferencesPage
            },
            {
                path: "custom-travel", Component: NewTravelRequestPage
            },
            {
                path: "my-custom-travels", Component: MyCustomTravelsPage
            },
        ]
    },


    //staff dashboard page routes:
    {
        path: 'staff',
        Component: StaffLayout,
        children: [
            {
                index: true, Component: StaffOverviewPage
            },
            {
                path: "members-interest",
                Component: MembersInterestPage,
            },
            {
                path: "members-interest/:id",
                Component: MemberInterestDetailsPage,
            },
            {
                path: "calendar-demand",
                Component: CustomTravelCalendarPage,
            },
            {
                path: "calendar-demand/:date",
                // Component: CustomTravelCalendarPage,
                Component: CustomTravelDayPage
            },

        ],
    },


])

export default router