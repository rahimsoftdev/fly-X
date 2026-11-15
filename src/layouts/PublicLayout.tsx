
import Navbar from '@/components/shared/Navbar';
import { useAppSelector } from '@/store/hook';
import { useEffect } from 'react';
import { Outlet } from 'react-router';

const PublicLayout = () => {
    const theme = useAppSelector((state) => state.theme)
    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );
    }, [theme]);

    return (
        <div>
            <Navbar />
            <h1>This is Public Layout</h1>
            <Outlet />
        </div>
    );
};

export default PublicLayout;