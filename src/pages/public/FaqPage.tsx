import FaqList from '@/components/public/FaqList';
import CallToAction from '@/components/shared/CallToAction';

// images: 
import homeCallActionImg from '@/assets/images/homeCallActionImg.png'


const FaqPage = () => {
    return (
        <div>

            <h1>faq page</h1>
            <FaqList />

            <CallToAction
             image={homeCallActionImg}
                imageAlt="image"
                buttonLink="/"
                heading="Ready to Elevate Your Travel Experience?"
                description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                buttonText="Become a Member"
            />
        </div>
    );
};

export default FaqPage;