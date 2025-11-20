async function getFastPosts(apiUrls) {
  try {
    // Create fetch promises for all URLs
    const fetchPromises = apiUrls.map((url) =>
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    );

    // Return the first one that resolves (fastest)
    const fastestData = await Promise.race(fetchPromises);
    return fastestData;
  } catch (error) {
    console.error("All requests failed:", error.message);
    throw error;
  }
}

// Usage example:
const apiUrls = [
  "https://jsonplaceholder.typicode.com/posts/4",
  "https://jsonplaceholder.typicode.com/posts/5",
  "https://jsonplaceholder.typicode.com/posts/6",
];

getFastPosts(apiUrls)
  .then((fastestPost) => {
    console.log("Fastest post received:", fastestPost);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
