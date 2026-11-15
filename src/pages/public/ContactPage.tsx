import contactHeroImg from '@/assets/images/hero3.png'
import ContactForm from '@/components/public/ContactForm';
import ContactMethods from '@/components/public/ContactMethods';
import PageHero from '@/components/public/PageHero';
import CallToAction from '@/components/shared/CallToAction';
//images:
import contatfooter from '@/assets/images/contatfooter.png'


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

            <CallToAction image={contatfooter}
                imageAlt="image"
                buttonLink="/"
                heading="Ready to Elevate Your Travel Experience?"
                description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                buttonText="Become a Member"
            />
        </div>
    );
};

export default ContactPage;