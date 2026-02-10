"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "/api";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  time: string;
  state: string;
}

export default function WorkerBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("workerToken");
    if (!token) {
      router.push("/worker");
      return;
    }

    fetch(`${API_URL}/bookings/worker`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load bookings");
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setLoading(false);
      });
  }, [router]);

  async function handleDelete(bookingId: number) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const token = localStorage.getItem("workerToken");
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking");
      }

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, state: "deleted" } : b
        )
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete booking";
      setErrorMessage(errorMsg);
    }
  }

  function handleLogout() {
    localStorage.removeItem("workerToken");
    router.push("/worker");
  }

  return (
    <section className="py-12 px-4 min-h-[70vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-700">
            All Bookings
          </h2>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-700 px-5 py-2 rounded-full font-semibold border-2 border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-purple-700 text-3xl"></i>
            <p className="text-gray-500 mt-4">Loading bookings...</p>
          </div>
        )}

        {errorMessage && (
          <p className="text-red-600 text-center font-medium mb-4">
            {errorMessage}
          </p>
        )}

        {!loading && bookings.length === 0 && !errorMessage && (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-gray-300 text-5xl mb-4"></i>
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50 text-purple-700">
                  <th className="px-6 py-4 text-left font-bold">Time</th>
                  <th className="px-6 py-4 text-left font-bold">Name</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Phone</th>
                  <th className="px-6 py-4 text-left font-bold">Service</th>
                  <th className="px-6 py-4 text-left font-bold">State</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-gray-100 hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">{booking.time}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.email}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.phone}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          booking.state === "deleted"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {booking.state === "deleted" ? "Deleted" : "Valid"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.state !== "deleted" && (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
