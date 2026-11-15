import contactHeroImg from '@/assets/images/hero3.png'
import ContactForm from '@/components/public/ContactForm';
import ContactMethods from '@/components/public/ContactMethods';
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
            <ContactMethods />
            <ContactForm />
        </div>
    );
};

export default ContactPage;