
import Navbar from '@/components/shared/Navbar';
import { Outlet } from 'react-router';

const PublicLayout = () => {

    return (
        <div>
            <Navbar />
            <h1>This is Public Layout</h1>
            <Outlet />
        </div>
    );
};

export default PublicLayout;