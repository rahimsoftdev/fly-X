import FlightOperations from "@/components/public/FlightOperations";
import PrivateJetPricing from "@/components/public/PrivateJetPricing";
import WhatYouReceive from "@/components/public/WhatYouReceive";

//images: 
import homeCallActionImg from '@/assets/images/homeCallActionImg.png'
import CallToAction from "@/components/shared/CallToAction";
import MembershipJourney from "@/components/public/MembershipJourney";


const MembershipPage = () => {
    return (
        <div>
            <MembershipJourney/>
            <PrivateJetPricing />
            <FlightOperations />
            <WhatYouReceive />

            <CallToAction image={homeCallActionImg}
                imageAlt="image"
               buttonLink="/register"
                heading="Ready to Join the Network"
                description="Apply now and begain your premium travel journy."
                buttonText="Start Application"
                isDark={true}
            />
        </div>
    );
};

export default MembershipPage;