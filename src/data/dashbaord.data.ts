import {
    Home,
    Plane,
    History,
    FileText,
    ArrowLeftRight,
    Plus,
    MessageCircle,
    Bell,
    User,
    Calendar,
    Users,
    UserCog,
    UserPlus,
    Settings,
} from "lucide-react";


export const userNavigation = [
    {
        label: "Overview",
        path: "/user",
        icon: Home,
    },
    {
        label: "Travel Opportunities",
        path: "/user/travel-opportunities",
        icon: Plane,
    },
    {
        label: "Pending Reservations",
        path: "/user/pending-reservations",
        icon: History,
    },
    {
        label: "Upcoming Trips",
        path: "/user/upcoming-trips",
        icon: FileText,
    },
    {
        label: "Travel Preferences",
        path: "/user/travel-preferences",
        icon: ArrowLeftRight,
    },
    {
        label: "Custom Travel",
        path: "/user/my-custom-travels",
        icon: Plus,
    },
    {
        label: "Message",
        path: "/user/message",
        icon: MessageCircle,
    },
    {
        label: "Notification",
        path: "/user/notification",
        icon: Bell,
    },
    {
        label: "Profile",
        path: "/user/profile",
        icon: User,
    },
];


export const staffNavigation = [
    {
        label: "Dashboard",
        path: "/staff",
        icon: Home,
    },
    {
        label: "Calendar Demand",
        path: "/staff/calendar-demand",
        icon: Calendar,
    },
    {
        label: "Members Interest",
        path: "/staff/members-interest",
        icon: Users,
    },
    {
        label: "Opportunities",
        path: "/staff/opportunities",
        icon: Plane,
    },
    {
        label: "Travel Preferences",
        path: "/staff/travel-preferences",
        icon: ArrowLeftRight,
    },
    {
        label: "Message",
        path: "/staff/message",
        icon: MessageCircle,
    },
    {
        label: "Profile",
        path: "/staff/profile",
        icon: User,
    },
];


export const adminNavigation = [
    {
        label: "Dashboard Overview",
        path: "/admin",
        icon: Home,
    },
    {
        label: "Members",
        path: "/admin/members",
        icon: Users,
    },
    {
        label: "Concierge Staff",
        path: "/admin/concierge-staff",
        icon: UserCog,
    },
    {
        label: "Add Concierge",
        path: "/admin/add-concierge",
        icon: UserPlus,
    },
    {
        label: "Setting",
        path: "/admin/setting",
        icon: Settings,
    },
];