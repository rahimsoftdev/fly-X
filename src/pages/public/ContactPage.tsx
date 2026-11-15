import contactHeroImg from '@/assets/images/hero3.png'
import PageHero from '@/components/public/PageHero';

const ContactPage = () => {
    return (
        <div>
            <PageHero
                image={contactHeroImg}
                imageAlt="Private jet flying above the clouds"
                heading="Frequently Asked Questions"
                description="Find answers to common questions about membership, travel safety, and billing."
            />
        </div>
    );
};

export default ContactPage;