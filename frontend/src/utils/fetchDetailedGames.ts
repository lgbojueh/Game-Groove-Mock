// src/utils/fetchDetailedGames.ts
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

      // Extract designer and publisher info from <link> elements.
      let designers: string[] = [];
      let publishers: string[] = [];
      Array.from(item.getElementsByTagName("link")).forEach((link) => {
        const type = link.getAttribute("type");
        const value = link.getAttribute("value");
        if (type === "boardgamedesigner" && value) {
          designers.push(value);
        }
        if (type === "boardgamepublisher" && value) {
          publishers.push(value);
        }
      });

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
        designers,
        publishers,
      };
    });

    return games;
  } catch (error) {
    console.error("Error fetching detailed games:", error);
    return [];
  }
};