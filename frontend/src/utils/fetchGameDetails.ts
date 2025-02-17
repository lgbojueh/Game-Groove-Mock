export const fetchGameDetails = async (id: string) => {
            try {
              console.log("Fetching game details for id:", id);
              const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}`);
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
          
              // Extract the basic details
              const idAttr = item.getAttribute("id");
              const name =
                item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
              const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";
              const description =
                item.getElementsByTagName("description")[0]?.textContent || "No description available.";
          
              // You can extract more fields if available (e.g., year published, ratings, etc.)
          
              return { id: idAttr, name, thumbnail, description };
            } catch (error) {
              console.error("Error fetching game details:", error);
              return null;
            }
          };          