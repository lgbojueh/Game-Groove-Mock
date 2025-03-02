// src/utils/fetchGameDetails.ts
export const fetchGameDetails = async (id: string) => {
  try {
    console.log("Fetching game details for id:", id);
    const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    console.log("Game details XML:", xmlText);

    // Convert the XML into a document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const item = xmlDoc.getElementsByTagName("item")[0];
    if (!item) {
      throw new Error("No game details found");
    }

    // Extract basic details
    const idAttr = item.getAttribute("id");
    const name = item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
    const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";
    const description = item.getElementsByTagName("description")[0]?.textContent || "No description available.";

    // Optionally, if you want to include stats from the XML
    // (not all details are provided by the thing endpoint without additional parameters)
    // you can add dummy filter values similar to fetchDetailedGames.ts.
    const complexity = "medium"; // Dummy value: "easy", "medium", "hard"
    const players = "3-4";         // Dummy value: "2", "3-4", "5+"
    const playtime = "medium";     // Dummy value: "short", "medium", "long"
    const genre = "strategy";      // Dummy value: "strategy", "party", "family", etc.
    const age = "teen";            // Dummy value: "kids", "teen", "adult"
    const theme = "adventure";     // Dummy value: "adventure", "fantasy", etc.

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