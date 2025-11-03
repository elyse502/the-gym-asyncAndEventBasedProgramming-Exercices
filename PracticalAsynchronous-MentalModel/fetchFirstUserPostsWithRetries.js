// Generic helper: Fetch with retry using Promises
function fetchWithRetry(url, options = {}, retries = 3) {
  return fetch(url, options)
    .then((response) => {
      // Retry on non-200 responses
      if (!response.ok) {
        if (retries > 0) {
          console.warn(`Retrying... (${3 - retries + 1}) for ${url}`);
          return fetchWithRetry(url, options, retries - 1);
        } else {
          return Promise.reject(
            new Error(
              `Failed after 3 retries: ${response.status} ${response.statusText}`
            )
          );
        }
      }
      // Parse JSON if successful
      return response.json();
    })
    .catch((error) => {
      // Retry on network failure
      if (retries > 0) {
        console.warn(
          `Network error: ${error.message}. Retrying... (${3 - retries + 1})`
        );
        return fetchWithRetry(url, options, retries - 1);
      } else {
        return Promise.reject(
          new Error(`Network request failed after 3 retries: ${error.message}`)
        );
      }
    });
}

// Main function using Promises only
function fetchFirstUserPostsWithRetries() {
  // Step 1: Fetch users
  return fetchWithRetry("https://jsonplaceholder.typicode.com/users").then(
    (users) => {
      if (!users.length) {
        throw new Error("No users found");
      }

      const firstUser = users[0];

      // Step 2: Fetch posts for that user
      return fetchWithRetry(
        `https://jsonplaceholder.typicode.com/posts?userId=${firstUser.id}`
      ).then((posts) => {
        // Step 3: Return combined result
        return {
          user: firstUser,
          posts: posts,
        };
      });
    }
  );
}

// Usage Example
fetchFirstUserPostsWithRetries()
  .then((data) => {
    console.log("✅ Success:", data);
    // Or pretty-print the result as JSON if preferred
    // console.log("✅ Success:", JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("❌ Error:", error.message);
  });
