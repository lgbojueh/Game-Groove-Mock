// src/app/blog/[id]/BlogPostClient.tsx
"use client";

import { useParams } from "next/navigation";

// Simulated static data for blog posts
export type BlogPostType = {
  id: string;
  title: string;
  date: string;
  dateTime: string;
  fullContent: string;
};

const posts: Record<string, BlogPostType> = {
  "1": {
    id: "1",
    title: "Top 5 Board Games for Family Game Night",
    date: "January 15, 2025",
    dateTime: "2025-01-15",
    fullContent: `Family game night is a time-honored tradition, and the right games can make it truly special. Here are our top five picks:

1. <strong>Catan</strong> – A modern classic where resource trading and strategy lead to endless replayability.  
2. <strong>Ticket to Ride</strong> – Easy to learn and always competitive, perfect for all ages.  
3. <strong>Pandemic</strong> – A cooperative challenge that brings everyone together against a common threat.  
4. <strong>Azul</strong> – Beautifully designed tile-laying that’s quick to teach and endlessly engaging.  
5. <strong>Wingspan</strong> – A serene strategy game where you build a network of birds in your wildlife preserve.

Each title excels at bringing families closer through laughter, strategy, and teamwork. Enjoy your next game night!`,
  },
  "2": {
    id: "2",
    title: "How to Host an Unforgettable Game Night",
    date: "February 10, 2025",
    dateTime: "2025-02-10",
    fullContent: `Hosting a standout game night involves planning, atmosphere, and engagement. Follow these best practices:

- <strong>Curate Your Lineup:</strong> Mix heavy hitters like <strong>Catan</strong> with light fillers like <strong>Dixit</strong>.  
- <strong>Set the Vibe:</strong> Soft lighting, comfortable seating, and a variety of snacks keep players relaxed.  
- <strong>Balance Competition:</strong> Alternate competitive games (e.g., <strong>Risk</strong>) with cooperative experiences (e.g., <strong>Forbidden Island</strong>).  
- <strong>Rotate Teams:</strong> Change pairings each round to keep conversations fresh and inclusive.  
- <strong>Debrief Together:</strong> After gameplay, share favorite moments and strategies to build community.

With these tips, your game night will be the talk of the town—time after time!`,
  },
  "3": {
    id: "3",
    title: "New Releases: The Hottest Board Games of 2025",
    date: "March 5, 2025",
    dateTime: "2025-03-05",
    fullContent: `2025 has brought an exciting wave of innovation to tabletop gaming. Don’t miss these standout releases:

- <strong>Eclipse: Second Dawn</strong> – A space 4X epic with deep strategy and gorgeous miniatures.  
- <strong>Everdell: Spirecrest</strong> – Expands the beloved Everdell universe with new challenges and environments.  
- <strong>Sleeping Gods</strong> – An open-world cooperative narrative that unfolds over multiple sessions.  
- <strong>Red Rising</strong> – A card-driven engine builder set in Pierce Brown’s sci-fi universe.  
- <strong>The Artemis Project: Deep Space</strong> – A reimagining of the Arctic survival game as a sci-fi colony simulator.

These titles are already generating buzz for their unique mechanics, stunning components, and immersive themes. Be sure to add them to your collection!`,
  },
};

export default function BlogPostClient() {
  const { id } = useParams();
  const post = id && !Array.isArray(id) ? posts[id] : undefined;

  if (!post) {
    return (
      <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <p>Post not found. Please check the URL or return to the blog index.</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <article className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <time dateTime={post.dateTime} className="text-sm text-gray-500">
            {post.date}
          </time>
        </header>

        <section className="prose prose-invert">
          {post.fullContent.split("\n").map((para, idx) =>
            para.trim() ? (
              <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
            ) : null
          )}
        </section>
      </article>
    </main>
  );
}
