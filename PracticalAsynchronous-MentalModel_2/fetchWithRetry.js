const fetchWithRetry = async (url, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === maxRetries) break;

      // Exponential backoff: 1s, 2s, 4s...
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error(
    `All ${maxRetries} attempts failed. Last error: ${lastError.message}`
  );
};

// Promise wrapper for fetchWithRetry
const fetchWithRetryPromise = (url, maxRetries = 3) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fetchWithRetry(url, maxRetries);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

// Example usage:
fetchWithRetry("https://jsonplaceholder.typicode.com/posts/1", 3)
  .then((data) => console.log("Final success:", data))
  .catch((error) => console.error("Final failure:", error.message));

// Using the promise wrapper
fetchWithRetryPromise("https://jsonplaceholder.typicode.com/todos/1")
  .then((data) => console.log("Todo:", data))
  .catch((error) => console.error("Failed:", error.message));
