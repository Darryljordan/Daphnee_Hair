import Link from "next/link";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1632&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div className="z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-fade-in-up">
            Welcome to Daphnee Hair
          </h1>
          <p className="text-white text-lg md:text-2xl mb-6 animate-fade-in-up animate-delay-100">
            Experience beauty, luxury, and relaxation.
          </p>
          <Link
            href="/book"
            className="inline-block bg-gradient-to-r from-purple-400 to-purple-700 text-white px-9 py-3.5 rounded-full font-bold text-lg shadow-lg hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 no-underline animate-fade-in-up animate-delay-200"
          >
            Book Now
          </Link>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full"
          height="40"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#faf7f2"
            fillOpacity="1"
            d="M0,224L1440,320L1440,320L0,320Z"
          />
        </svg>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-br from-purple-100 to-white py-16 px-4 rounded-xl shadow-lg my-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
            alt="Salon interior"
            className="rounded-xl shadow-lg w-full md:w-1/2 animate-fade-in-up"
          />
          <div className="w-full md:w-1/2 animate-fade-in-up animate-delay-100">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
              About Us
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              At Daphnee Hair, we blend artistry and care to create your perfect
              look in a relaxing, luxurious environment.
            </p>
            <Link
              href="/services"
              className="inline-block bg-white text-purple-700 px-7 py-3 rounded-full font-semibold border-2 border-purple-300 hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 no-underline"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />
    </>
  );
}
