function fetchWithTimeoutRace(url, timeout = 3) {
  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout: exceeded ${timeout}ms`));
    }, timeout);
  });

  // Create fetch promise
  const fetchPromise = fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });

  // Race between fetch and timeout
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Enhanced Version with Better Error Handling
/* class FetchWithTimeout {
  static async request(url, timeout = 3000) { // Default 3 seconds for real use
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      console.log(`Fetching ${url} with ${timeout}ms timeout...`);
      
      const response = await fetch(url, { signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Request completed successfully');
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      switch (error.name) {
        case 'AbortError':
          throw new Error(`⏰ Timeout: Request took longer than ${timeout}ms`);
        case 'TypeError':
          throw new Error('🌐 Network error: Failed to fetch');
        default:
          throw new Error(`❌ Request failed: ${error.message}`);
      }
    }
  }
}

// Usage with realistic timeout (3 seconds instead of 3ms)
FetchWithTimeout.request('https://restcountries.com/v3.1/all', 3000)
  .then(countries => {
    console.log(`🌍 Successfully fetched ${countries.length} countries`);
  })
  .catch(error => {
    console.error('💥', error.message);
  }); */

// Usage
fetchWithTimeoutRace("https://restcountries.com/v3.1/all", 3)
  .then((countries) => {
    console.log(`Fetched ${countries.length} countries`);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Use 5000ms (5 seconds) for real API calls
fetchWithTimeoutRace("https://restcountries.com/v3.1/all", 5000)
  .then((countries) => {
    console.log(`Fetched ${countries.length} countries successfully`);
    // Example: Show first country
    if (countries.length > 0) {
      console.log("First country:", countries[0].name.common);
    }
  })
  .catch((error) => {
    console.error("Failed to fetch countries:", error.message);
  });
