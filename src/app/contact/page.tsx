"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <>
      <section className="bg-gradient-to-br from-purple-100 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start justify-center gap-10">
          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Contact Information
            </h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <i className="fas fa-envelope text-purple-700 text-xl"></i>
                <span className="text-gray-600">info@daphneehair.com</span>
              </div>
              <div className="flex items-center gap-4">
                <i className="fas fa-map-marker-alt text-purple-700 text-xl"></i>
                <span className="text-gray-600">
                  123 Main Street, City, Country
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Send Us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              For custom appointments or any inquiries
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Type your message..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer"
              >
                Send Message
              </button>
              {submitted && (
                <p className="text-green-600 text-center font-medium mt-2">
                  Message sent! We&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="w-full h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353159046!3d-37.81627974202159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f1f1f1%3A0x5045675218ce6e0!2s123%20Main%20St%2C%20City!5e0!3m2!1sen!2sau!4v1614648358360!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </>
  );
}
