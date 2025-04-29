// src/components/RatingAndComments.tsx
"use client";

import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getGuestId } from "@/utils/guest";

interface Comment {
  id: number;
  username: string;
  text: string;
  createdAt: string;
  replies: Array<{
    id: number;
    username: string;
    text: string;
    createdAt: string;
    parentId: number;
  }>;
}

export default function RatingAndComments({ gameId }: { gameId: string }) {
  const [userId] = useState(() => {
    // if you have next-auth session, you can swap in session.user.id here
    return typeof window !== "undefined"
      ? localStorage.getItem("guestId") || getGuestId()
      : getGuestId();
  });

  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // load user rating
    fetch(`/api/auth/ratings?gameId=${gameId}&userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRating(d.rating ?? 0))
      .catch(console.error);

    // load average
    fetch(`/api/auth/ratings/average?gameId=${gameId}`)
      .then((r) => r.json())
      .then((d) => setAverage(d.average ?? 0))
      .catch(console.error);

    // load comments
    fetch(`/api/auth/comments?gameId=${gameId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(console.error);
  }, [gameId, userId]);

  const handleRate = async (val: number) => {
    setRating(val);
    await fetch("/api/auth/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, rating: val, userId }),
    });
    // refresh average
    const avg = await fetch(`/api/auth/ratings/average?gameId=${gameId}`).then((r) =>
      r.json()
    );
    setAverage(avg.average);
    setFeedback("Thank you for your rating!");
    setTimeout(() => setFeedback(""), 3000);
  };

  const postComment = async (parentId: number | null = null) => {
    if (!newComment.trim()) return;
    await fetch("/api/auth/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, text: newComment, parentId, userId }),
    });
    setNewComment("");
    setComments(await fetch(`/api/auth/comments?gameId=${gameId}`).then((r) => r.json()));
  };

  return (
    <div className="mt-8 space-y-6 text-[var(--foreground)]">
      <div>
        <strong>Average Rating:</strong> {average.toFixed(1)} ★
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
        <ReactStars
          count={5}
          value={rating}
          onChange={handleRate}
          size={32}
          activeColor="#800020"
          emptyIcon={<FaRegStar />}
          filledIcon={<FaStar />}
          isHalf={false}
          edit={true}
          a11y={true}
        />
        {feedback && <p className="text-green-600">{feedback}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          maxLength={200}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Your thoughts…"
        />
        <button
          onClick={() => postComment(null)}
          className="mt-2 px-4 py-2 bg-[#800020] text-white rounded hover:bg-red-700"
        >
          Post Comment
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <strong>{c.username}</strong>{" "}
              <span className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </span>
              <p className="mt-1">{c.text}</p>
              {c.replies.map((r) => (
                <div key={r.id} className="ml-6 mt-2 p-2 bg-gray-200 rounded">
                  <strong>{r.username}</strong>{" "}
                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                  <p className="mt-1">{r.text}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
