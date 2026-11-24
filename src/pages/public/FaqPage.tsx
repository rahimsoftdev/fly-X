import FaqList from '@/components/public/FaqList';
import CallToAction from '@/components/shared/CallToAction';
import PageHero from '@/components/public/PageHero';

// images: 
import homeCallActionImg from '@/assets/images/homeCallActionImg.png'
import faqHeroImg from '@/assets/images/hero2.png'


const FaqPage = () => {
    return (
        <div>

            <PageHero
                image={faqHeroImg}
                imageAlt="Private jet flying above the clouds"
                heading="Frequently Asked Questions"
                description="Find answers to common questions about membership, travel safety, and billing."
            />
            <FaqList />

            <CallToAction
                image={homeCallActionImg}
                imageAlt="image"
                buttonLink="/contact"
                heading="Still Have Questions"
                description="See how Raven transforms the way you travel. Apply for membership today."
                buttonText="Contact US"
                isDark={true}
            />
        </div>
    );
};

export default FaqPage;