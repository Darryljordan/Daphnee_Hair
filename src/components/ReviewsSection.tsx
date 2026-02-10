"use client";

import { useState } from "react";

const initialReviews = [
  {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment: "Amazing service! My hair has never looked better.",
  },
  {
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    comment: "Friendly staff and great results. Highly recommend!",
  },
  {
    name: "Sophie Laurent",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    comment: "The best hair salon I've ever been to. Absolutely love it!",
  },
];

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (star: number) => void;
}) {
  return (
    <div className="flex gap-0.5 text-xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`${
            star <= rating ? "fas fa-star text-amber-400" : "far fa-star text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 5,
  });

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (newReview.name && newReview.comment && newReview.rating) {
      setReviews([
        {
          name: newReview.name,
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
          rating: newReview.rating,
          comment: newReview.comment,
        },
        ...reviews,
      ]);
      setNewReview({ name: "", comment: "", rating: 5 });
    }
  }

  return (
    <section className="bg-gradient-to-br from-purple-100 to-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-purple-700 mb-10">
          What Our Clients Say
        </h2>

        {/* Review Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 animate-fade-in-up hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <img
                src={review.avatar}
                alt={review.name}
                className="w-14 h-14 rounded-full object-cover shadow-sm"
              />
              <div>
                <h3 className="text-purple-700 font-bold text-lg mb-1">
                  {review.name}
                </h3>
                <StarRating rating={review.rating} />
                <p className="text-gray-500 mt-2">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Review Submission Form */}
        <div className="bg-white rounded-2xl shadow-md max-w-md mx-auto p-8 flex flex-col items-center">
          <h3 className="text-purple-700 font-bold text-xl mb-5">
            Leave a Review
          </h3>
          <form onSubmit={submitReview} className="w-full space-y-4">
            <div>
              <label
                htmlFor="reviewName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="reviewName"
                type="text"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <div>
              <label
                htmlFor="reviewComment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comment
              </label>
              <textarea
                id="reviewComment"
                rows={3}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <StarRating
                rating={newReview.rating}
                interactive
                onRate={(star) =>
                  setNewReview({ ...newReview, rating: star })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-400 to-purple-700 text-white py-3 rounded-full font-bold text-base shadow hover:from-purple-700 hover:to-purple-400 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
