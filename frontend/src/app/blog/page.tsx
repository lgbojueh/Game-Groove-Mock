export default function Blog() {
            return (
              <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
                <h1 className="text-4xl font-bold mb-6">Blog</h1>
                <article className="mb-6">
                  <h2 className="text-2xl font-semibold">First Blog Post</h2>
                  <p className="mt-2">This is the content of our first blog post.</p>
                </article>
                <article className="mb-6">
                  <h2 className="text-2xl font-semibold">Another Blog Post</h2>
                  <p className="mt-2">More interesting blog content goes here.</p>
                </article>
              </main>
            );
          }          