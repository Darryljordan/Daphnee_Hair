"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hairdressing-backend.vercel.app/api";

export default function BookPage() {
  const router = useRouter();
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      router.push("/thank-you");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Booking failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gradient-to-br from-purple-100 to-white py-16 min-h-[70vh]">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-700 mb-6 text-center">
            Book an Appointment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={booking.name}
                onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={booking.email}
                onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={booking.phone}
                onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service"
                value={booking.service}
                onChange={(e) => setBooking({ ...booking, service: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
              >
                <option value="">Select a service</option>
                <option>Haircut &amp; Styling</option>
                <option>Coloring</option>
                <option>Treatments</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={booking.date}
                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                id="time"
                type="time"
                value={booking.time}
                onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
            {message && (
              <p className="text-red-600 text-center font-medium mt-2">{message}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
