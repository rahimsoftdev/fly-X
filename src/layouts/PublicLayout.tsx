
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import ScrollToHash from '@/components/shared/ScrollToHash';
import { Outlet } from 'react-router';

const PublicLayout = () => {

    return (
        <div>
            <ScrollToHash/>
            <Navbar />
            <Outlet />
            <Footer/>
        </div>
    );
};

export default PublicLayout;