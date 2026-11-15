import { useAppDispatch, useAppSelector } from '@/store/hook';
import { toggleTheme } from '@/store/slices/themeSlice';
import React, { useEffect } from 'react';

const Navbar = () => {
    const theme = useAppSelector((state) => state.theme)
    const dispatch = useAppDispatch()
    console.log(theme)


    return (
        <div>
            <h1>namvbar</h1>
            <button onClick={() => dispatch(toggleTheme())}>toggle theme</button>
        </div>
    );
};

export default Navbar;