import React from 'react';
import { Outlet } from 'react-router';

const PublicLayout = () => {
    return (
        <div>
            <h1>This is Public Layout</h1>
            <Outlet/>
        </div>
    );
};

export default PublicLayout;