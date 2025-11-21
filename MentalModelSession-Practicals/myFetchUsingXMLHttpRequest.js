const { XMLHttpRequest } = require("xmlhttprequest");

function myFetch(url) {
  return new Promise((resolve, reject) => {
    // Create XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open("GET", url);

    // Set up event handlers
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Success - resolve with response
        resolve({
          ok: true,
          status: xhr.status,
          statusText: xhr.statusText,
          json: () => Promise.resolve(JSON.parse(xhr.responseText)),
          text: () => Promise.resolve(xhr.responseText),
        });
      } else {
        // HTTP error - reject with status
        reject(new Error(`HTTP Error: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = function () {
      // Network error
      reject(new Error("Network error: Failed to make request"));
    };

    xhr.ontimeout = function () {
      // Timeout error
      reject(new Error("Request timeout"));
    };

    // Set timeout (optional - 10 seconds default)
    xhr.timeout = 10000;

    // Send the request
    try {
      xhr.send();
    } catch (error) {
      reject(new Error(`Request failed: ${error.message}`));
    }
  });
}

// Enhanced Version with More Features:
/* function myFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Set method (default to GET)
    const method = options.method || 'GET';
    xhr.open(method, url);
    
    // Set headers if provided
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    
    // Set timeout
    if (options.timeout) {
      xhr.timeout = options.timeout;
    }
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          ok: true,
          status: xhr.status,
          statusText: xhr.statusText,
          url: xhr.responseURL,
          json: () => {
            try {
              return Promise.resolve(JSON.parse(xhr.responseText));
            } catch (error) {
              return Promise.reject(new Error('Invalid JSON response'));
            }
          },
          text: () => Promise.resolve(xhr.responseText)
        });
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error occurred'));
    xhr.ontimeout = () => reject(new Error(`Request timeout after ${xhr.timeout}ms`));
    
    // Handle request body for POST/PUT
    try {
      if (options.body) {
        xhr.send(options.body);
      } else {
        xhr.send();
      }
    } catch (error) {
      reject(new Error(`Failed to send request: ${error.message}`));
    }
  });
} */

// Example usage
// Simple GET request
myFetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.json())
  .then((data) => {
    console.log("\n\nData:", data);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// With error handling for different scenarios
myFetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then((data) => console.log("\n\nSuccess:", data))
  .catch((error) => {
    if (error.message.includes("Network error")) {
      console.error("Check your internet connection");
    } else if (error.message.includes("timeout")) {
      console.error("Request took too long");
    } else if (error.message.includes("HTTP")) {
      console.error("Server returned an error");
    } else {
      console.error("Unknown error:", error.message);
    }
  });

// Test with invalid URL to see error handling
myFetch("https://invalid-url-that-does-not-exist.com")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Caught error:", error.message));

// Another example usage
myFetch("https://jsonplaceholder.typicode.com/users")
  .then((data) => console.log("\n\nResult:", data))
  .catch((error) => console.log("Error:", error));
