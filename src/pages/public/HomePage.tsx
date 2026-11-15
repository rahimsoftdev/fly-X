
// import {Button} from '@heroui/react'

import Banner from "@/components/public/Banner";
import CuratedTravel from "@/components/public/CuratedTravel";
import HowItWorks from "@/components/public/HowItWorks";
import PremiumBenefits from "@/components/public/PremiumBenefits";

const HomePage = () => {
    return (
        <div className=''>
            
            <Banner/>
            <HowItWorks/>
            <CuratedTravel/>
            <PremiumBenefits/>
            
        </div>
    );
};

export default HomePage;