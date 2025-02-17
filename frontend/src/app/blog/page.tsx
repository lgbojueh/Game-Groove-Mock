import Link from "next/link";

const posts = [
  {
    id: "1",
    title: "Top 5 Board Games for Family Game Night",
    summary:
      "Discover the best board games that bring the family together for fun, laughter, and friendly competition. Perfect for all ages!",
    date: "March 20, 2023",
  },
  {
    id: "2",
    title: "How to Host an Unforgettable Game Night",
    summary:
      "Learn practical tips and creative ideas for hosting a game night that your friends and family will never forget.",
    date: "April 10, 2023",
  },
  {
    id: "3",
    title: "New Releases: The Hottest Board Games of 2023",
    summary:
      "Stay up-to-date with the latest board game releases and find out which ones are making waves in the gaming community.",
    date: "May 5, 2023",
  },
];

export default function Blog() {
  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition"
          >
            <Link href={`/blog/${post.id}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="mb-1">{post.summary}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {post.date}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}