// src/components/RatingAndComments.tsx
"use client";

import { useState, useEffect } from "react";
import StarRating from "react-rating-stars-component";
import { getGuestId } from "@/utils/guest";

interface Comment {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
}

export default function RatingAndComments({ gameId }: { gameId: string }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const userId = typeof window !== "undefined"
    ? (localStorage.getItem("guestId") || getGuestId())
    : "";

  useEffect(() => {
    // load rating
    fetch(`/api/ratings?gameId=${gameId}&userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRating(d.rating));

    // load comments
    fetch(`/api/comments?gameId=${gameId}`)
      .then((r) => r.json())
      .then(setComments);
  }, [gameId, userId]);

  const handleRate = (newRating: number) => {
    setRating(newRating);
    fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, rating: newRating }),
    });
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, text: newComment }),
    });
    if (res.ok) {
      const created = await res.json();
      setComments([created, ...comments]);
      setNewComment("");
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Your Rating</h3>
        <StarRating
          count={5}
          value={rating}
          onChange={handleRate}
          size={24}
          activeColor="#800020"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">Leave a Comment</h3>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          maxLength={200}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What did you think? (max 200 chars)"
        />
        <button
          onClick={submitComment}
          className="mt-2 px-4 py-2 bg-[#800020] text-white rounded hover:bg-red-700"
        >
          Post Comment
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Comments</h3>
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <p className="text-[var(--foreground)]">{c.text}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
