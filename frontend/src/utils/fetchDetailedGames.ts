export const fetchDetailedGames = async (ids: string[]) => {
  try {
    const response = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/thing?id=${ids.join(",")}&stats=1`
    );
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    // Define arrays of possible values for random assignment.
    const playersOptions = ["2", "3-4", "5+"];
    const complexityOptions = ["easy", "medium", "hard"];
    const playtimeOptions = ["short", "medium", "long"];
    const ageOptions = ["kids", "teen", "adult"];
    const possibleGenres = ["strategy", "party", "family", "abstract", "cooperative"];
    const possibleThemes = ["historical", "fantasy", "sci-fi", "horror", "adventure"];

    const games = items.map((item) => {
      const id = item.getAttribute("id") || "";
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      const description =
        item.getElementsByTagName("description")[0]?.textContent ||
        "No description available.";

      // Randomly assign values so that not all games have the same dummy filters.
      const players = playersOptions[Math.floor(Math.random() * playersOptions.length)];
      const complexity = complexityOptions[Math.floor(Math.random() * complexityOptions.length)];
      const playtime = playtimeOptions[Math.floor(Math.random() * playtimeOptions.length)];
      const age = ageOptions[Math.floor(Math.random() * ageOptions.length)];
      const genre = possibleGenres[Math.floor(Math.random() * possibleGenres.length)];
      const theme = possibleThemes[Math.floor(Math.random() * possibleThemes.length)];

      return {
        id,
        name,
        thumbnail,
        description,
        players,
        complexity,
        playtime,
        age,
        genre,
        theme,
      };
    });

    return games;
  } catch (error) {
    console.error("Error fetching detailed games:", error);
    return [];
  }
};
