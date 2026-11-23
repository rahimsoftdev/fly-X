import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { adminNavigation, staffNavigation, userNavigation } from '@/data/dashbaord.data';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { logout } from '@/utils/auth.util';

type NavItem = { label: string; path: string; icon: LucideIcon };

// sidebar e jei field gula lage
type SidebarUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
} | null;

/* ---------- Flyx Logo ---------- */
const Logo = ({
    onClick,
    showText = true,
    size = 38,
}: {
    onClick?: () => void;
    showText?: boolean;
    size?: number;
}) => (
    <Link
        to="/"
        onClick={onClick}
        className="group flex flex-col items-center justify-center focus:outline-none"
    >
        <svg
            width={size}
            height={size * 0.79}
            viewBox="0 0 44 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary transition-transform duration-300 group-hover:scale-105"
        >
            <path
                d="M6 2H26C32.5 2 37 6 37 11.5C37 15.8 34.2 19.2 30 20.4L38 31H27.5L20.5 21H15L19 31H10L5 18H23.5C26.5 18 28.5 16.2 28.5 13.5C28.5 10.8 26.5 9 23.5 9H9L6 2Z"
                fill="currentColor"
            />
            <path d="M2 11H16L14 14.5H4L2 11Z" fill="currentColor" />
        </svg>
        {showText && (
            <span className="mt-1 text-[10px] font-extrabold tracking-[0.28em] text-secondary dark:text-white">
                Flyx
            </span>
        )}
    </Link>
);

/* ---------- Avatar (image ba name er prothom okkhor) ---------- */
const Avatar = ({ user }: { user: SidebarUser }) => {
    const name = user?.name ?? 'User';
    const image = user?.image;

    if (image) {
        return (
            <img
                src={image}
                alt={name}
                className="size-10 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
            />
        );
    }
    return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold uppercase text-white">
            {name.charAt(0)}
        </div>
    );
};

/* ---------- Sidebar er vitorer content (mobile + desktop dutoi use kore) ---------- */
type ContentProps = {
    links: NavItem[];
    user: SidebarUser;
    collapsed: boolean;
    onNavigate: () => void;
    onLogout: () => void;
    onToggle?: () => void; // desktop collapse button
    onClose?: () => void; // mobile close button
};

const SidebarContent = ({
    links,
    user,
    collapsed,
    onNavigate,
    onLogout,
    onToggle,
    onClose,
}: ContentProps) => {
    return (
        <div className="flex h-full flex-col bg-[var(--background)] text-[var(--heading-text)]">
            {/* Header */}
            <div
                className={`flex shrink-0 border-b border-[var(--border-color)] px-4 ${
                    collapsed
                        ? 'flex-col items-center gap-3 py-3'
                        : 'h-16 items-center justify-between'
                }`}
            >
                <Logo onClick={onNavigate} showText={!collapsed} size={collapsed ? 30 : 38} />

                {onToggle && (
                    <button
                        onClick={onToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="rounded-lg p-2 text-[var(--paragraph-text)] transition hover:bg-primary/10 hover:text-primary"
                    >
                        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                )}

                {onClose && (
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="rounded-lg p-2 text-[var(--paragraph-text)] transition hover:bg-primary/10 hover:text-primary"
                    >
                        <X size={22} />
                    </button>
                )}
            </div>

            {/* Links: scrollbar hidden + scroll baire jabe na */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ul className="space-y-1">
                    {links.map(({ label, path, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                end={path.split('/').length === 2} // /user, /staff, /admin e exact match
                                onClick={onNavigate}
                                title={collapsed ? label : undefined}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        collapsed ? 'justify-center' : ''
                                    } ${
                                        isActive
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-[var(--paragraph-text)] hover:bg-primary/10 hover:text-primary'
                                    }`
                                }
                            >
                                <Icon size={20} className="shrink-0" />
                                {!collapsed && <span className="truncate">{label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Profile + Logout */}
            <div className="shrink-0 border-t border-[var(--border-color)] p-3">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <Avatar user={user} />
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--heading-text)]">
                                {user?.name ?? 'Guest'}
                            </p>
                            <p className="truncate text-xs text-[var(--paragraph-text)]">
                                {user?.email}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    title={collapsed ? 'Logout' : undefined}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

/* ---------- Main Component ---------- */
const DashboardSidebar = () => {
    const navigate = useNavigate();
    const { user: currentUser, role } = useCurrentUser();

    const [mobileOpen, setMobileOpen] = useState(false); // choto device drawer
    const [collapsed, setCollapsed] = useState(false); // boro device icon-only mode

    // link role onujayi
    const links: NavItem[] =
        role === 'admin'
            ? adminNavigation
            : role === 'staff'
                ? staffNavigation
                : role === 'user'
                    ? userNavigation
                    : [];

    // Drawer khola thakle body scroll bondho + Esc diye close
    useEffect(() => {
        if (!mobileOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [mobileOpen]);

    const handleLogout = async () => {
        await logout(); // better-auth session clear
        setMobileOpen(false);
        navigate('/login', { replace: true });
    };

    return (
        <>
            {/* ===== Mobile / Tablet top navbar (lg er niche): logo bame, menu icon dane ===== */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] px-4 lg:hidden">
                <Logo size={32} />
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="rounded-lg p-2 text-[var(--heading-text)] transition hover:bg-primary/10 hover:text-primary"
                >
                    <Menu size={26} />
                </button>
            </header>

            {/* ===== Mobile / Tablet drawer (dan theke ashbe) ===== */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
                aria-hidden={!mobileOpen}
            >
                {/* overlay */}
                <div
                    onClick={() => setMobileOpen(false)}
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                        mobileOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                {/* panel */}
                <aside
                    className={`absolute right-0 top-0 h-dvh w-72 max-w-[85%] border-l border-[var(--border-color)] shadow-xl transition-transform duration-300 ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <SidebarContent
                        links={links}
                        user={currentUser}
                        collapsed={false}
                        onNavigate={() => setMobileOpen(false)}
                        onLogout={handleLogout}
                        onClose={() => setMobileOpen(false)}
                    />
                </aside>
            </div>

            {/* ===== Desktop sidebar (lg ba boro) ===== */}
            <aside
                className={`sticky top-0 hidden h-dvh shrink-0 border-r border-[var(--border-color)] transition-[width] duration-300 lg:block ${
                    collapsed ? 'w-20' : 'w-64'
                }`}
            >
                <SidebarContent
                    links={links}
                    user={currentUser}
                    collapsed={collapsed}
                    onNavigate={() => { }}
                    onLogout={handleLogout}
                    onToggle={() => setCollapsed((c) => !c)}
                />
            </aside>
        </>
    );
};

export default DashboardSidebar;