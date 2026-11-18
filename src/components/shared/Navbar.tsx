import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { toggleTheme } from '@/store/slices/themeSlice';
import { getCurrentUser, logout } from '@/utils/auth.util';

const Navbar: React.FC = () => {

    //mobile device navbar open and close toggle state:
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    //get theme and dispatch from redux store: 
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    //check login from localStorage (user exists = logged in):
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        () => !!localStorage.getItem('raven_auth_user')
    );

    //re-check on every page change, so after login / register the buttons update:
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('raven_auth_user'));
    }, [location.pathname]);

    //nav links:
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Membership', path: '/membership' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ];

    //real logout: remove user from localStorage, update buttons, go to home:
    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const user = getCurrentUser()
    console.log(user, 'ur')

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--background)]/95 backdrop-blur-md transition-colors duration-300">
            <nav className="container-main flex h-20 items-center justify-between">
                
                {/* Left: Brand Logo (RAVEN) */}
                <Link 
                    to="/" 
                    className="flex flex-col items-center justify-center group focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <svg 
                        width="38" 
                        height="30" 
                        viewBox="0 0 44 34" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary transition-transform duration-300 group-hover:scale-105"
                    >
                        <path 
                            d="M6 2H26C32.5 2 37 6 37 11.5C37 15.8 34.2 19.2 30 20.4L38 31H27.5L20.5 21H15L19 31H10L5 18H23.5C26.5 18 28.5 16.2 28.5 13.5C28.5 10.8 26.5 9 23.5 9H9L6 2Z" 
                            fill="currentColor" 
                        />
                        <path 
                            d="M2 11H16L14 14.5H4L2 11Z" 
                            fill="currentColor" 
                        />
                    </svg>
                    <span className="mt-1 text-[10px] font-extrabold tracking-[0.28em] text-secondary dark:text-white">
                        RAVEN
                    </span>
                </Link>

                {/* Center: Desktop & Laptop Navigation Links */}
                <ul className="hidden lg:flex items-center gap-2 xl:gap-5">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-[var(--foreground)] hover:text-primary hover:bg-primary/10'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right: Theme Toggle & Auth Buttons (Desktop & Laptop) */}
                <div className="hidden lg:flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => dispatch(toggleTheme())}
                        aria-label="Toggle Theme"
                        className="p-2.5 rounded-full border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--card)] transition-colors cursor-pointer"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-secondary" />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
                            >
                                Become a Member
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-95"
                            >
                                Log In
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile & Tablet Controls */}
                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => dispatch(toggleTheme())}
                        aria-label="Toggle Theme"
                        className="p-2 rounded-full border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-secondary" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                        className="p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--card)] focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile & Tablet Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--background)] px-4 pt-4 pb-6 shadow-lg transition-all">
                    <ul className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block w-full px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'text-[var(--foreground)] hover:bg-[var(--card)] hover:text-primary'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth Buttons */}
                    <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row gap-3">
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    Become a Member
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;