import Link from "next/link";

export default function ThankYouPage() {
  return (
    <section className="flex flex-col items-center justify-center py-32 bg-gray-50 min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-lg">
        <i className="fas fa-check-circle text-green-500 text-5xl mb-6"></i>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">
          Your appointment request has been received.
          <br />
          We appreciate your trust in Daphnee Hair Studio.
          <br />
          Our team will contact you soon to confirm your booking.
        </p>
        <Link
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 no-underline"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
