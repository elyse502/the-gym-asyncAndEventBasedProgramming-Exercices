/**
 * Fetches posts from multiple sources concurrently and returns data from the fastest source.
 *
 * @param {Array} urls - The list of API endpoints to fetch posts from.
 * @returns {Promise} - A promise that resolves with the data from the fastest responding source.
 */
async function getFastPosts(urls) {
  const fetchPromises = urls.map((url) =>
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching from ${url}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Failed to fetch from ${url}: ${error.message}`);
        throw error; // Propagate error for Promise.any to handle
      })
  );

  try {
    // Use Promise.any to return the result from the fastest responding source
    const fastPosts = await Promise.any(fetchPromises);
    return fastPosts; // Return the posts from the fastest source
  } catch (error) {
    // If all sources fail, reject with a message
    console.error("All fetch attempts failed:", error);
    throw new Error("All sources failed to respond.");
  }
}

// Example usage
const apiUrls = [
  "https://dummyjson.com/posts",
  "https://this-may-not-exist.com/posts",
  "https://jsonplaceholder.typicode.com/posts",
];

getFastPosts(apiUrls)
  .then((posts) => {
    console.log("Posts from the fastest source:", posts);
  })
  .catch((error) => {
    console.error("Error fetching posts:", error.message);
  });
