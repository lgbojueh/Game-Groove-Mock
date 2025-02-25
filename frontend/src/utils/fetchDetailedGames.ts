export const fetchDetailedGames = async (ids: string[]) => {
            try {
              const joinedIds = ids.join(",");
              console.log("Fetching detailed games for IDs:", joinedIds);
              const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${joinedIds}`);
              if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
              }
              const xmlText = await response.text();
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "text/xml");
              const items = Array.from(xmlDoc.getElementsByTagName("item"));
              // Map each XML item to a game object.
              const games = items.map((item) => {
                const id = item.getAttribute("id");
                const name = item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
                const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";
                const description = item.getElementsByTagName("description")[0]?.textContent || "No description available.";
                return { id, name, thumbnail, description };
              });
              return games;
            } catch (error) {
              console.error("Error fetching detailed games:", error);
              return [];
            }
          };
          