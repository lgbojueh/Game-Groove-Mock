"use client";
import { useParams, useRouter } from "next/navigation";

const posts = {
  "1": {
    id: "1",
    title: "Top 5 Board Games for Family Game Night",
    date: "January 15, 2025",
    fullContent: `Family game nights are a cherished tradition, and choosing the right board games can make them even more memorable.
    
Here are our top 5 recommendations:
1. Game A – A classic that never disappoints.
2. Game B – Engaging and fun for all ages.
3. Game C – Perfect for long nights of strategy.
4. Game D – Quick and easy to learn.
5. Game E – A modern twist on a timeless favorite.

These games have been carefully selected for their replayability and ability to bring everyone together. Enjoy your next family game night!`,
  },
  "2": {
    id: "2",
    title: "How to Host an Unforgettable Game Night",
    date: "February 10, 2025",
    fullContent: `Hosting a game night can be both exciting and challenging. Here are some tips to ensure your game night is unforgettable:
    
- **Plan Ahead:** Choose a mix of games that suit different interests.
- **Set the Mood:** Create a comfortable environment with good lighting and snacks.
- **Mix it Up:** Include both competitive and cooperative games.
- **Engage Everyone:** Make sure every guest feels included by rotating teams or partners.
- **Relax and Enjoy:** Remember, the goal is to have fun together!

Follow these steps and you’ll be well on your way to hosting a game night that your guests will talk about for months to come.`,
  },
  "3": {
    id: "3",
    title: "New Releases: The Hottest Board Games of 2025",
    date: "March 5, 2025",
    fullContent: `The board game world is constantly evolving, and 2025 is no exception. Here are some of the hottest new releases this year:
    
- **Game X:** A groundbreaking strategy game that challenges your planning skills.
- **Game Y:** An innovative party game that has everyone laughing.
- **Game Z:** A beautifully designed game that combines art with fun mechanics.

These new releases are already creating a buzz in the gaming community. Be sure to check them out and discover your next favorite game!`,
  },
};

export default function BlogPost() {
  const { id } = useParams();
  const router = useRouter();
  const post = posts[id as keyof typeof posts];

  if (!post) {
    return (
      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Post Not Found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
        {post.date}
      </p>
      <article className="prose dark:prose-dark max-w-none">
        {post.fullContent.split("\n\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </article>
      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Back to Blog
      </button>
    </main>
  );
}