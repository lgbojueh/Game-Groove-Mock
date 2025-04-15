// src/utils/fetchGameDetails.ts

export const fetchGameDetails = async (id: string) => {
  try {
    const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const item = xmlDoc.getElementsByTagName("item")[0];
    if (!item) throw new Error("No game details found");

    const name =
      item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
    const thumbnail =
      item.getElementsByTagName("thumbnail")[0]?.textContent || "/default-game-thumbnail.jpg";
    const description =
      item.getElementsByTagName("description")[0]?.textContent || "No description available.";

    // Random dummy filter values for consistency
    const playersOptions = ["2", "3-4", "5+"];
    const complexityOptions = ["easy", "medium", "hard"];
    const playtimeOptions = ["short", "medium", "long"];
    const genreOptions = ["strategy", "party", "family", "abstract"];
    const ageOptions = ["kids", "teen", "adult"];
    const themeOptions = ["historical", "fantasy", "sci-fi", "horror", "adventure"];

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    return {
      id,
      title: name, // 👈 aligned with your Prisma schema's "title"
      thumbnail,
      description,
      players: getRandom(playersOptions),
      complexity: getRandom(complexityOptions),
      playtime: getRandom(playtimeOptions),
      genre: getRandom(genreOptions),
      age: getRandom(ageOptions),
      theme: getRandom(themeOptions),
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
};
