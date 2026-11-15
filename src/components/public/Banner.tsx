import heroImage from "@/assets/images/hero.png";

const Banner = () => {
  return (
    <section className="w-full py-5 md:py-8">
      <div className="container-main">
        {/* মেইন ইমেজ ও কাটআউট র‍্যাপার */}
        <div className="relative w-full">
          {/* ব্যাকগ্রাউন্ড ইমেজ কন্টেইনার (উচ্চতা কমানো হয়েছে) */}
          <div className="relative w-full h-[260px] sm:h-[320px] md:h-[400px] lg:h-[450px] xl:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              src={heroImage}
              alt="Private Jet Flying Above Clouds"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* ছবির ওপর হালকা গ্রেডিয়েন্ট */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* বাম-নিচের ইনভার্টেড কাটআউট কন্টেন্ট বক্স (Tablet, Laptop, Desktop) */}
          <div
            className="
              relative md:absolute md:bottom-0 md:left-0 z-10
              w-full md:w-[56%] lg:w-[50%] xl:w-[46%]
              bg-[var(--background)]
              pt-5 md:pt-7 lg:pt-8
              pr-0 md:pr-8 lg:pr-10
              pb-1 md:pb-3
              md:rounded-tr-[28px]
            "
          >
            {/* উপরের বাম দিকের ইনভার্টেড কার্ভ */}
            <span
              aria-hidden="true"
              className="hidden md:block absolute -top-[24px] left-0 w-[24px] h-[24px] inverted-curve-top pointer-events-none"
            />

            {/* ডান-নিচের ইনভার্টেড কার্ভ */}
            <span
              aria-hidden="true"
              className="hidden md:block absolute bottom-0 -right-[24px] w-[24px] h-[24px] inverted-curve-right pointer-events-none"
            />

            {/* টেক্সট এবং বাটন কন্টেন্ট */}
            <div>
              <h1
                className="title-text xl:text-5xl font-bold"
                
              >
                Private Travel <br />
                Reimagined
              </h1>

              <p className="mt-2.5 sm:mt-3 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Join an exclusive network that transforms travel demand into
                shared private charter opportunities.
              </p>

              <div className="mt-4 sm:mt-5">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95 cursor-pointer"
                >
                  Become a Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;