import Banner from "@/components/public/Banner";
import CuratedTravel from "@/components/public/CuratedTravel";
import HowItWorks from "@/components/public/HowItWorks";
import PremiumBenefits from "@/components/public/PremiumBenefits";
import PrivateAviation from "@/components/public/PrivateAviation";
import CallToAction from "@/components/shared/CallToAction";
import FAQ from "@/components/public/FAQ";

//images: 
import homeCallActionImg from '@/assets/images/homeCallActionImg.png'

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
                buttonLink="/register"
                heading="Ready to Elevate Your Travel Experience?"
                description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                buttonText="Become a Member"
                isDark={true}
            />
        </div>
    );
};

export default HomePage;