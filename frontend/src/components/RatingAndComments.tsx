// src/components/RatingAndComments.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getGuestId } from "@/utils/guest";

interface Comment {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
  parentId: number | null;
  replies: Comment[];
}

export default function RatingAndComments({ gameId }: { gameId: string }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? getGuestId();

  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    // fetch user's rating
    fetch(`/api/ratings?gameId=${gameId}&userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRating(d.rating ?? 0));

    // fetch average rating
    fetch(`/api/ratings/average?gameId=${gameId}`)
      .then((r) => r.json())
      .then((d) => setAverage(d.average ?? 0));

    // fetch comments + replies
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

  const submitComment = async (parentId: number | null = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, text, parentId }),
    });

    setNewComment("");
    setReplyText("");
    setReplyTo(null);

    // refresh comments
    fetch(`/api/comments?gameId=${gameId}`)
      .then((r) => r.json())
      .then(setComments);
  };

  return (
    <div className="mt-8 space-y-6 text-[var(--foreground)]">
      {/* Average Rating */}
      <div>
        <span className="font-semibold">Average Rating:</span>{" "}
        <span>{average.toFixed(1)} ★</span>
      </div>

      {/* Your Rating */}
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
        />
      </div>

      {/* Comment Form */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          maxLength={200}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What did you think? (max 200 chars)"
        />
        <button
          onClick={() => submitComment(null)}
          className="mt-2 px-4 py-2 bg-[#800020] text-white rounded hover:bg-red-700"
        >
          Post Comment
        </button>
      </div>

      {/* Comments & Replies */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <p>{c.text}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>

              {c.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {c.replies.map((r) => (
                    <div
                      key={r.id}
                      className="p-2 bg-gray-200 dark:bg-gray-600 rounded"
                    >
                      <p>{r.text}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {replyTo === c.id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full border p-1 rounded"
                    rows={2}
                    maxLength={200}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                  />
                  <button
                    onClick={() => submitComment(c.id)}
                    className="mt-1 px-3 py-1 bg-[#800020] text-white rounded hover:bg-red-700"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyTo(c.id);
                    setReplyText("");
                  }}
                  className="mt-2 text-sm text-blue-500"
                >
                  Reply
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
