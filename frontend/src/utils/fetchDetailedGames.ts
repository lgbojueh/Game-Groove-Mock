// src/utils/fetchDetailedGames.ts
export const fetchDetailedGames = async (ids: string[]) => {
  try {
    // Fetch details using the "thing" endpoint and request stats.
    const response = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/thing?id=${ids.join(
        ","
      )}&stats=1`
    );
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games = items.map((item) => {
      const id = item.getAttribute("id") || "";
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      const description =
        item.getElementsByTagName("description")[0]?.textContent || "";

      // Parse numeric stats if available
      const minplayers = parseInt(
        item.getElementsByTagName("minplayers")[0]?.textContent || "0",
        10
      );
      const maxplayers = parseInt(
        item.getElementsByTagName("maxplayers")[0]?.textContent || "0",
        10
      );
      const playingtime = parseInt(
        item.getElementsByTagName("playingtime")[0]?.textContent || "0",
        10
      );
      const minage = parseInt(
        item.getElementsByTagName("minage")[0]?.textContent || "0",
        10
      );
      const averageweight = parseFloat(
        item.getElementsByTagName("averageweight")[0]?.textContent || "0"
      );

      // Map numeric values to filter fields:
      // Players: use a simple mapping based on min/max players.
      let players = "3-4";
      if (minplayers <= 2 && maxplayers >= 2) {
        players = "2";
      }
      if (minplayers <= 5 && maxplayers >= 5) {
        players = "5+";
      }

      // Complexity based on average weight
      let complexity = "medium";
      if (averageweight < 2.0) {
        complexity = "easy";
      } else if (averageweight >= 3.5) {
        complexity = "hard";
      }

      // Playtime: classify based on playingtime
      let playtimeCategory = "medium";
      if (playingtime <= 30) {
        playtimeCategory = "short";
      } else if (playingtime > 60) {
        playtimeCategory = "long";
      }

      // Age: map minage to a category.
      let ageCategory = "teen";
      if (minage <= 5) {
        ageCategory = "kids";
      } else if (minage >= 18) {
        ageCategory = "adult";
      }

      // For Genre and Theme, BGG provides some data via <link> elements.
      // For simplicity, we'll use dummy values or you could parse them if needed.
      const genre = "strategy";
      const theme = "adventure";

      return {
        id,
        name,
        thumbnail,
        description,
        players,
        complexity,
        playtime: playtimeCategory,
        genre,
        age: ageCategory,
        theme,
      };
    });

    return games;
  } catch (error) {
    console.error("Error fetching detailed games:", error);
    return [];
  }
};