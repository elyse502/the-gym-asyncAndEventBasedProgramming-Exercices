// Generic helper to perform fetch with retry logic
async function fetchWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);

    // Retry on non-2xx responses
    if (!response.ok) {
      if (retries > 0) {
        console.warn(`Retrying... (${3 - retries + 1}) for ${url}`);
        return await fetchWithRetry(url, options, retries - 1);
      } else {
        throw new Error(
          `Failed after 3 retries: ${response.status} ${response.statusText}`
        );
      }
    }

    // Return JSON data if successful
    return await response.json();
  } catch (error) {
    // Retry on network errors
    if (retries > 0) {
      console.warn(
        `Network error: ${error.message}. Retrying... (${3 - retries + 1})`
      );
      return await fetchWithRetry(url, options, retries - 1);
    } else {
      throw new Error(
        `Network request failed after 3 retries: ${error.message}`
      );
    }
  }
}

// Main function to fetch first user and their posts
async function fetchFirstUserPostsWithRetries() {
  // Step 1: Fetch all users with retry logic
  const users = await fetchWithRetry(
    "https://jsonplaceholder.typicode.com/users"
  );
  if (!users.length) throw new Error("No users found");

  // Step 2: Select the first user
  const firstUser = users[0];

  // Step 3: Fetch posts for the first user
  const posts = await fetchWithRetry(
    `https://jsonplaceholder.typicode.com/posts?userId=${firstUser.id}`
  );

  // Step 4: Return combined data
  return {
    user: firstUser,
    posts: posts,
  };
}

// Example usage
fetchFirstUserPostsWithRetries()
  .then((data) => console.log("✅ Success:", data))
  .catch((error) => console.error("❌ Error:", error.message));
