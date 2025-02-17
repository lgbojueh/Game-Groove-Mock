export default function About() {
            return (
              <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
                <h1 className="text-4xl font-bold mb-6">About Game Grove</h1>
                <section className="mb-4">
                  <p className="mb-2">
                    Welcome to <strong>Game Grove</strong> – your ultimate board game recommendation app. We understand that finding the perfect board game for your group can be overwhelming. Whether you’re planning a game night, hosting an event, or simply looking for a new game to try, our app simplifies the selection process.
                  </p>
                  <p className="mb-2">
                    <strong>Our Purpose:</strong> 
                    Game Grove helps users find the best board game based on their preferences. Our recommendations consider several key factors, such as:
                  </p>
                  <ul className="list-disc ml-6 mb-4">
                    <li><strong>Number of Players:</strong> Whether it's 2, 3, 4, or up to 6 players.</li>
                    <li><strong>Difficulty Level:</strong> Choose games from Easy, Medium, or Hard difficulty levels.</li>
                    <li><strong>Playtime:</strong> Options range from Short to Medium and Long sessions.</li>
                    <li><strong>Game Type/Genre:</strong> From Strategy and Party to Family and more, we cover a wide range of genres.</li>
                    <li><strong>Other Filters:</strong> Discover games that are cooperative or competitive, tailored to your group's style.</li>
                  </ul>
                  <p className="mb-2">
                    Our mission at <strong>Game Grove</strong> is to make board game selection effortless and enjoyable. We leverage advanced recommendation algorithms and curated game data to match you with games that perfectly fit your unique preferences.
                  </p>
                  <p>
                    Thank you for choosing Game Grove. We hope our app helps you create memorable game nights and discover new favorites for every occasion.
                  </p>
                </section>
              </main>
            );
          }          