import { NavLink, Outlet, useLocation } from "react-router";
import authImg from "@/assets/images/auth.png";

/* Text shown on the image for each page */
const content = {
  login: {
    title: "Begin Your Journey",
    text: "Experience private travel with unmatched comfort, exclusivity, and concierge support.",
  },
  register: {
    title: "Become a Raven Member",
    text: "Complete your registration and gain access to exclusive charter flight opportunities.",
  },
};

// Tab link style (active tab is filled blue)
const tabClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-6 py-1.5 text-xs font-medium transition-all duration-300 sm:px-8 sm:text-sm ${
    isActive
      ? "bg-primary text-white shadow-sm"
      : "text-(--heading-text) hover:text-primary"
  }`;

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isRegister = pathname.startsWith("/register");
  const { title, text } = isRegister ? content.register : content.login;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#F9FBFF] transition-colors duration-300 dark:bg-[#0B1220] lg:grid-cols-2">
      {/* ---------- Left: image (top banner on mobile, sticky half on desktop) ---------- */}
      <aside className="relative isolate h-56 overflow-hidden bg-[#0B1220] sm:h-72 lg:sticky lg:top-0 lg:h-screen">
        <img
          src={authImg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        {/* Soft gradient so the white text stays readable */}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        <div className="flex h-full flex-col items-center justify-end gap-2 px-6 pb-8 text-center sm:pb-10 lg:justify-center lg:pb-0 lg:pt-24">
          <p className="font-playfair text-2xl font-medium text-white sm:text-3xl xl:text-4xl">
            {title}
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-white/90 sm:max-w-sm sm:text-sm">
            {text}
          </p>
        </div>
      </aside>

      {/* ---------- Right: tabs + page content ---------- */}
      <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="w-full max-w-xl space-y-6">
          {/* Login / Sign Up tabs */}
          <nav
            aria-label="Authentication"
            className="inline-flex rounded-full bg-primary/10 p-1"
          >
            <NavLink to="/login" className={tabClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={tabClass}>
              Sign Up
            </NavLink>
          </nav>

          {/* LoginPage or RegisterPage renders here */}
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;