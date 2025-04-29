"use client";

import { useState, useEffect } from "react";
import StarRating from "react-rating-stars-component";
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
  const userId = typeof window !== "undefined" ? getGuestId() : "unknown";

  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetch(`/api/ratings?gameId=${gameId}&userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRating(d.rating ?? 0));

    fetch(`/api/ratings/average?gameId=${gameId}`)
      .then((r) => r.json())
      .then((d) => setAverage(d.average ?? 0));

    fetch(`/api/comments?gameId=${gameId}`)
      .then((r) => r.json())
      .then(setComments);
  }, [gameId, userId]);

  const handleRate = (newRating: number) => {
    const r = Math.floor(newRating);
    setRating(r);
    fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, rating: r }),
    });
  };

  const submitComment = async (parentId: number | null = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, text, parentId }),
    });
    if (res.ok) {
      const created: Comment = await res.json();
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [created, ...c.replies] }
              : c
          )
        );
        setReplyText("");
        setReplyTo(null);
      } else {
        setComments([created, ...comments]);
        setNewComment("");
      }
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  return (
    <div className="mt-8 space-y-6 text-[var(--foreground)]">
      <div>
        <span className="font-semibold">Average Rating:</span>{" "}
        <span>{average.toFixed(1)} ★</span>
      </div>

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
          onClick={() => submitComment(null)}
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
