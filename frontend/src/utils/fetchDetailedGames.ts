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
        item.getElementsByTagName("description")[0]?.textContent ||
        "No description available.";

      // Parse numeric stats for players, playingtime, minage, and averageweight.
      const minplayersText = item.getElementsByTagName("minplayers")[0]?.textContent;
      const maxplayersText = item.getElementsByTagName("maxplayers")[0]?.textContent;
      const playingtimeText = item.getElementsByTagName("playingtime")[0]?.textContent;
      const minageText = item.getElementsByTagName("minage")[0]?.textContent;
      const averageweightText = item.getElementsByTagName("averageweight")[0]?.textContent;

      const minplayers = minplayersText ? parseInt(minplayersText, 10) : NaN;
      const maxplayers = maxplayersText ? parseInt(maxplayersText, 10) : NaN;
      const playingtime = playingtimeText ? parseInt(playingtimeText, 10) : NaN;
      const minage = minageText ? parseInt(minageText, 10) : NaN;
      const averageweight = averageweightText ? parseFloat(averageweightText) : NaN;

      // Map number of players to a filter category.
      let playersFilter = "any";
      if (!isNaN(minplayers) && !isNaN(maxplayers)) {
        if (minplayers === maxplayers) {
          playersFilter = String(minplayers);
        } else if (maxplayers <= 2) {
          playersFilter = "2";
        } else if (maxplayers >= 3 && maxplayers <= 4) {
          playersFilter = "3-4";
        } else if (maxplayers >= 5) {
          playersFilter = "5+";
        }
      }

      // Map average weight to complexity.
      let complexityFilter = "any";
      if (!isNaN(averageweight)) {
        if (averageweight < 2.0) {
          complexityFilter = "easy";
        } else if (averageweight >= 3.5) {
          complexityFilter = "hard";
        } else {
          complexityFilter = "medium";
        }
      }

      // Map playing time to playtime category.
      let playtimeCategory = "any";
      if (!isNaN(playingtime)) {
        if (playingtime <= 30) {
          playtimeCategory = "short";
        } else if (playingtime > 60) {
          playtimeCategory = "long";
        } else {
          playtimeCategory = "medium";
        }
      }

      // Map minage to an age category.
      let ageCategory = "any";
      if (!isNaN(minage)) {
        if (minage <= 5) {
          ageCategory = "kids";
        } else if (minage >= 18) {
          ageCategory = "adult";
        } else {
          ageCategory = "teen";
        }
      }

      // For Genre and Theme, BGG may provide data via <link> elements.
      // You can try to parse those here. For now, we default to "any".
      const genre = "any";
      const theme = "any";

      return {
        id,
        name,
        thumbnail,
        description,
        players: playersFilter,
        complexity: complexityFilter,
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