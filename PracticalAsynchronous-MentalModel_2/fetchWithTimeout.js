async function fetchWithTimeout(url, timeout = 10) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timeout: exceeded ${timeout}ms`);
    }

    throw new Error(`Fetch failed: ${error.message}`);
  }
}

// Usage with error handling
fetchWithTimeout("https://jsonplaceholder.typicode.com/posts/1")
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error.message));
