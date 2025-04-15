// src/utils/fetchGameDetails.ts
export const fetchGameDetails = async (id: string) => {
  try {
    console.log("Fetching game details for id:", id);
    const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const item = xmlDoc.getElementsByTagName("item")[0];
    if (!item) {
      throw new Error("No game details found");
    }

    // Extract the primary name
    const nameElements = Array.from(item.getElementsByTagName("name"));
    const primaryNameElement = nameElements.find((el) => el.getAttribute("type") === "primary");
    const name = primaryNameElement?.getAttribute("value") || "Unknown Game";

    const idAttr = item.getAttribute("id");
    const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";
    const description = item.getElementsByTagName("description")[0]?.textContent || "No description available.";

    // Dummy filters for now (aligns with other game utils)
    const complexity = "medium";
    const players = "3-4";
    const playtime = "medium";
    const genre = "strategy";
    const age = "teen";
    const theme = "adventure";

    return {
      id: idAttr,
      name,
      thumbnail,
      description,
      complexity,
      players,
      playtime,
      genre,
      age,
      theme,
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
};
