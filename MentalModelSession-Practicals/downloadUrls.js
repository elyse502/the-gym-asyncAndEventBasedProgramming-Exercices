async function downloadUrls(urls) {
  try {
    const fetchPromises = urls.map((url) =>
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} for URL: ${url}`
            );
          }
          return response.json(); // or response.text() for non-JSON
        })
        .catch((error) => {
          error.message = `Failed to fetch ${url}: ${error.message}`;
          throw error;
        })
    );

    const results = await Promise.all(fetchPromises);

    return results.map((content, index) => ({
      url: urls[index],
      content: content,
      status: "success",
    }));
  } catch (error) {
    console.error("Download failed:", error.message);
    throw error;
  }
}

// Example usage
const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
];

// Basic usage
downloadUrls(urls)
  .then((results) => {
    results.forEach((result) => {
      console.log(`${result.url}:`, result.content);
    });
  })
  .catch((error) => {
    console.error("Overall failure:", error.message);
  });

// Using promises:
/*const fetchMultipleAPIs = (apiUrls) => {
  const promises = apiUrls.map((url) =>
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${url}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Enhance error with URL context for better debugging
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      })
  );

  return Promise.all(promises);
};

// Usage example:
const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
];

fetchMultipleAPIs(urls)
  .then((results) => {
    console.log("All requests successful!");
    results.forEach((result, index) => {
      console.log(`Result ${index + 1}:`, result);
    });
  })
  .catch((error) => {
    console.error("One or more requests failed:", error.message);
  }); */
