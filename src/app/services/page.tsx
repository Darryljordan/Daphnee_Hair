import Link from "next/link";

const services = [
  {
    title: "Haircut & Styling",
    description: "Trendy cuts and professional styling for all hair types.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
  {
    title: "Coloring",
    description: "Vibrant colors, highlights, balayage, and more.",
    img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
  {
    title: "Treatments",
    description: "Nourishing treatments to keep your hair healthy and shiny.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
];

export default function ServicesPage() {
  return (
    <section className="bg-gradient-to-br from-purple-100 to-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-purple-700 mb-10">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl shadow-md p-8 text-center flex flex-col items-center hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-xl transition-all duration-200"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-16 h-16 rounded-full object-cover shadow-sm mb-5"
              />
              <h3 className="text-purple-700 font-bold text-xl mb-3">
                {service.title}
              </h3>
              <p className="text-gray-500 mb-5">{service.description}</p>
              <Link
                href="/book"
                className="inline-block bg-gradient-to-r from-purple-400 to-purple-700 text-white px-8 py-3 rounded-full font-bold shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 no-underline"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
