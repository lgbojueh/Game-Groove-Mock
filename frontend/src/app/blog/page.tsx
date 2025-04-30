// src/app/blog/page.tsx
import Link from "next/link";

const posts = [
  {
    id: "1",
    title: "Top 5 Board Games for Family Game Night",
    summary:
      "Discover the best board games that bring the family together for fun, laughter, and friendly competition. Perfect for all ages!",
    date: "January 15, 2025",
    dateTime: "2025-01-15",
  },
  {
    id: "2",
    title: "How to Host an Unforgettable Game Night",
    summary:
      "Learn practical tips and creative ideas for hosting a game night that your friends and family will never forget.",
    date: "February 10, 2025",
    dateTime: "2025-02-10",
  },
  {
    id: "3",
    title: "New Releases: The Hottest Board Games of 2025",
    summary:
      "Stay up-to-date with the latest board game releases and find out which ones are making waves in the gaming community.",
    date: "March 5, 2025",
    dateTime: "2025-03-05",
  },
];

export default function Blog() {
  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-center">
          Blog
        </h1>
      </header>

      {/* Posts List */}
      <section className="max-w-4xl mx-auto space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-6 bg-gray-50 dark:bg-gray-500 rounded-lg shadow-md hover:shadow-xl transition"
          >
            {/* Post Header */}
            <header>
              <Link
                href={`/blog/${post.id}`}
                className="block hover:underline"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {post.title}
                </h2>
              </Link>
            </header>

            {/* Post Summary */}
            <p className="mb-4">
              {post.summary}
            </p>

            {/* Post Date */}
            <footer>
              <p className="text-sm">
                <time dateTime={post.dateTime}>
                  {post.date}
                </time>
              </p>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
