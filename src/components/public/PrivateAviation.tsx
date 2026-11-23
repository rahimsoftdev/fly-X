// import FeatureRow from "../ui/FeatureRow";

import experienceImg from "@/assets/images/experienceImg.png";
import safetyImg from "@/assets/images/safetyImg.png";

import FeatureRow from "@/components/ui/FeatureRow";

const features = [
  {
    type: "right" as const,
    image: experienceImg,
    imageAlt: "Private jet flying above the clouds",
    eyebrow: "Experience",
    title: "The Private Aviation",
    highlight: "Difference",
    description:
      "See how Flyx redefines what travel means. Travel on your terms. No queues. No delays. Just pure, unfiltered luxury.",
  },
  {
    type: "left" as const,
    image: safetyImg,
    imageAlt: "Private jet parked on the tarmac at sunset",
    eyebrow: "Safety",
    title: "Uncompromising",
    highlight: "Safety Standards",
    description:
      "Safety is the foundation of every Flyx travel experience. All flights are operated by FAA-certificated Part 135 air carriers that maintain full operational control and meet rigorous safety, training, maintenance, and regulatory requirements. We partner only with qualified operators committed to delivering the highest standards of professionalism, reliability, and passenger safety.",
  },
];

export default function PrivateAviation() {
  return (
    <section
      id="private-aviation"
      className=" bg-(--background) transition-colors duration-300 "
    >
      <div className="container-main">
        <div className="flex flex-col gap-10 md:gap-12 xl:gap-section">
          {features.map((item) => (
            <FeatureRow key={item.eyebrow} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}