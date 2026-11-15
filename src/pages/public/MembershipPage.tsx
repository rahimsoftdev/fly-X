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
                buttonLink="/"
                heading="Ready to Elevate Your Travel Experience?"
                description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                buttonText="Become a Member"
                isDark={true}
            />
        </div>
    );
};

export default MembershipPage;