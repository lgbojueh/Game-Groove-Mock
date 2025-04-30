import styles from "../../styles/styles.module.css";

export default function About() {
  return (
    <main className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Using a header section for the title provides semantic clarity */}
      <header className="mb-8">
        <h1 className={styles.AboutTitleText}>About Game Groove</h1>
      </header>

      <article className="space-y-6">
        <section>
          <p className="text-lg">
            Welcome to <strong>Game Groove</strong> – your ultimate board game recommendation app. We understand that finding the perfect board game for your group can be overwhelming. Whether you’re planning a game night, hosting an event, or simply looking for a new game to try, our app simplifies the selection process.
          </p>
        </section>
        
        <section>
          <p className={styles.AboutText}>
            <strong>Our Purpose: </strong>
            Game Groove helps users find the best board game based on their preferences. Our recommendations consider several key factors, such as:
          </p>
          <ul className={styles.AboutText}>
            <li>
              <strong>Number of Players:</strong> Whether it&apos;s 2, 3, 4, or up to 6 players.
            </li>
            <li>
              <strong>Difficulty Level:</strong> Choose games from Easy, Medium, or Hard difficulty levels.
            </li>
            <li>
              <strong>Playtime:</strong> Options range from Short to Medium and Long sessions.
            </li>
            <li>
              <strong>Game Type/Genre:</strong> From Strategy and Party to Family and more, we cover a wide range of genres.
            </li>
            <li>
              <strong>Other Filters:</strong> Discover games that are cooperative or competitive, tailored to your group&apos;s style.
            </li>
          </ul>
        </section>
        
        <section>
          <p className="text-lg">
            Our mission at <strong>Game Groove</strong> is to make board game selection effortless and enjoyable. We leverage advanced recommendation algorithms and curated game data to match you with games that perfectly fit your unique preferences.
          </p>
        </section>
        
        <section>
          <p className="text-lg font-semibold">
            Thank you for choosing Game Groove. We hope our app helps you create memorable game nights and discover new favorites for every occasion.
          </p>
        </section>
      </article>
    </main>
  );
}
