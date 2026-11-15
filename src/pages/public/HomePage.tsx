
// import {Button} from '@heroui/react'

import Banner from "@/components/public/Banner";
import CuratedTravel from "@/components/public/CuratedTravel";
import HowItWorks from "@/components/public/HowItWorks";
import PremiumBenefits from "@/components/public/PremiumBenefits";
import PrivateAviation from "@/components/public/PrivateAviation";
import homeCallActionImg from '@/assets/images/homeCallActionImg.png'
import CallToAction from "@/components/shared/CallToAction";
import FAQ from "@/components/public/FAQ";

const HomePage = () => {
    return (
        <div className=''>

            <Banner />
            <HowItWorks />
            <CuratedTravel />
            <PremiumBenefits />
            <PrivateAviation />

            <FAQ />

            <CallToAction image={homeCallActionImg}
                imageAlt="image"
                buttonLink="/"
                heading="Ready to Elevate Your Travel Experience?"
                description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                buttonText="Become a Member"
            />
        </div>
    );
};

export default HomePage;