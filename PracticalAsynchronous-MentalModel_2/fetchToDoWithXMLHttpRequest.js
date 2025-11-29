const { XMLHttpRequest } = require("xmlhttprequest");

const fetchToDo = (url = "https://jsonplaceholder.typicode.com/todos/1") => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.timeout = 10000; // 10 second timeout

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log("Success:", data);
          resolve(data);
        } catch (parseError) {
          const error = new Error(
            `Failed to parse JSON: ${parseError.message}`
          );
          console.error(error.message);
          reject(error);
        }
      } else {
        const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
        console.error(error.message);
        reject(error);
      }
    };

    xhr.onerror = function () {
      const error = new Error("Network error occurred");
      console.error(error.message);
      reject(error);
    };

    xhr.ontimeout = function () {
      const error = new Error("Request timeout after 10 seconds");
      console.error(error.message);
      reject(error);
    };

    try {
      xhr.send();
    } catch (error) {
      console.error("Failed to send request:", error.message);
      reject(error);
    }
  });
};

// Usage with error handling
fetchToDo()
  .then((data) => console.log("Received todo:", data))
  .catch((error) => console.error("Final error:", error.message));

// Test with invalid URL
fetchToDo("https://invalid-url-that-does-not-exist.com")
  .then((data) => console.log("This should not run"))
  .catch((error) => console.error("Expected error:", error.message));
