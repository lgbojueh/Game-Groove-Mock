// src/utils/fetchDetailedGames.ts
export const fetchDetailedGames = async (ids: string[]) => {
  try {
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

    // Define arrays of possible values for genre and theme.
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
      const yearpublished =
        item.getElementsByTagName("yearpublished")[0]?.getAttribute("value") ||
        "0";
      const minage =
        item.getElementsByTagName("minage")[0]?.getAttribute("value") || "0";
      const minplayers =
        item.getElementsByTagName("minplayers")[0]?.getAttribute("value") ||
        "0";
      const maxplayers =
        item.getElementsByTagName("maxplayers")[0]?.getAttribute("value") ||
        "0";
      const playingtime =
        item.getElementsByTagName("playingtime")[0]?.getAttribute("value") ||
        "0";
      const averageRating =
        item.getElementsByTagName("average")[0]?.getAttribute("value") ||
        "0";
      const averageWeight =
        item.getElementsByTagName("averageweight")[0]?.textContent || "0";

      // Determine players filter field.
      let playersField = "3-4";
      if (parseInt(minplayers, 10) <= 2 && parseInt(maxplayers, 10) >= 2) {
        playersField = "2";
      }
      if (parseInt(minplayers, 10) <= 5 && parseInt(maxplayers, 10) >= 5) {
        playersField = "5+";
      }

      // Determine complexity based on average weight.
      let complexityField = "medium";
      const weight = parseFloat(averageWeight);
      if (weight < 2.0) {
        complexityField = "easy";
      } else if (weight >= 3.5) {
        complexityField = "hard";
      }

      // Determine playtime category.
      let playtimeCategory = "medium";
      const pt = parseInt(playingtime, 10);
      if (pt <= 30) {
        playtimeCategory = "short";
      } else if (pt > 60) {
        playtimeCategory = "long";
      }

      // Determine age category based on minage.
      let ageCategory = "teen";
      const ma = parseInt(minage, 10);
      if (ma <= 5) {
        ageCategory = "kids";
      } else if (ma >= 18) {
        ageCategory = "adult";
      }

      // Instead of hardcoding genre and theme, assign random values.
      const genreField =
        possibleGenres[Math.floor(Math.random() * possibleGenres.length)];
      const themeField =
        possibleThemes[Math.floor(Math.random() * possibleThemes.length)];

      return {
        id,
        name,
        thumbnail,
        description,
        yearpublished,
        minage,
        minplayers,
        maxplayers,
        playingtime,
        averageRating,
        averageWeight,
        players: playersField,
        complexity: complexityField,
        playtime: playtimeCategory,
        age: ageCategory,
        genre: genreField,
        theme: themeField,
      };
    });

    return games;
  } catch (error) {
    console.error("Error fetching detailed games:", error);
    return [];
  }
};