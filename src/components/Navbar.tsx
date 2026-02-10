"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
  { href: "/contact", label: "Contact" },
  { href: "/worker", label: "Access as Worker" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex flex-col items-center mt-8 mb-8">
      <Link href="/" className="text-4xl md:text-5xl font-black text-purple-700 tracking-wide text-center mb-5 leading-tight hover:opacity-80 transition-opacity no-underline">
        Daphnee Hair
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex justify-center gap-6 w-[75vw] max-w-[900px] mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-semibold px-5 py-2 rounded-full transition-all duration-200 no-underline ${
              pathname === link.href
                ? "text-white bg-gradient-to-r from-purple-400 to-purple-700 shadow-md"
                : "text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-700 hover:shadow-md"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-gray-500 text-2xl bg-transparent border-none cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col w-full mt-3 bg-white rounded-b-xl shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm px-6 py-4 transition-all duration-300 no-underline ${
                pathname === link.href
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-purple-600 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
