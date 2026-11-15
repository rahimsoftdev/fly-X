
// import {Button} from '@heroui/react'

import Banner from "@/components/public/Banner";
import CuratedTravel from "@/components/public/CuratedTravel";
import HowItWorks from "@/components/public/HowItWorks";

const HomePage = () => {
    return (
        <div className=''>
            
            <Banner/>
            <HowItWorks/>
            <CuratedTravel/>
            
        </div>
    );
};

export default HomePage;