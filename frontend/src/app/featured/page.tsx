export default function Featured() {
            return (
              <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
                <h1 className="text-4xl font-bold mb-6">Featured Games</h1>
          
                <section className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Popular Games</h2>
                  <p>Popular games will be showcased here.</p>
                </section>
          
                <section className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Top Rated Games</h2>
                  <p>Top rated games will be showcased here.</p>
                </section>
          
                <section>
                  <h2 className="text-2xl font-semibold mb-2">Your Favorites</h2>
                  <p>Your favorite games will be showcased here.</p>
                </section>
              </main>
            );
          }          