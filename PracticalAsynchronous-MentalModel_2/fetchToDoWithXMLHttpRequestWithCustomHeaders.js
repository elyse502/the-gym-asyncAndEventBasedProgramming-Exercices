const { XMLHttpRequest } = require("xmlhttprequest");

const fetchToDoEnhanced = (
  url = "https://jsonplaceholder.typicode.com/todos/1",
  method = "GET",
  payload = null
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.timeout = 10000;

    // Set custom headers
    xhr.setRequestHeader("User-Agent", "MyCustomApp/1.0.0");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onload = function () {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const responseText = xhr.responseText;

          if (!responseText) {
            console.log("Empty response received");
            resolve(null);
            return;
          }

          const data = JSON.parse(responseText);
          console.log("Success with headers:", {
            status: xhr.status,
            contentType: xhr.getResponseHeader("Content-Type"),
            data: data,
          });
          resolve(data);
        } else {
          throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
        }
      } catch (error) {
        console.error("Response handling failed:", error.message);
        reject(error);
      }
    };

    xhr.onerror = function () {
      const error = new Error("Network error - check URL and connection");
      console.error(error.message);
      reject(error);
    };

    xhr.ontimeout = function () {
      const error = new Error("Request timeout after 10 seconds");
      console.error(error.message);
      reject(error);
    };

    try {
      // Send with JSON payload if provided
      if (payload && (method === "POST" || method === "PUT")) {
        const jsonBody = JSON.stringify(payload);
        console.log("Sending JSON payload:", jsonBody);
        xhr.send(jsonBody);
      } else {
        xhr.send();
      }
    } catch (error) {
      console.error("Failed to send request:", error.message);
      reject(error);
    }
  });
};

// Usage examples
async function testEnhancedFetch() {
  try {
    // GET request
    console.log("=== Testing GET request ===");
    const todo = await fetchToDoEnhanced();
    console.log("GET result:", todo);

    // POST request with payload
    console.log("\n=== Testing POST request ===");
    const newTodo = await fetchToDoEnhanced(
      "https://jsonplaceholder.typicode.com/todos",
      "POST",
      {
        title: "Learn JavaScript",
        completed: false,
        userId: 1,
      }
    );
    console.log("POST result:", newTodo);
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run the tests
testEnhancedFetch();

// Individual usage
fetchToDoEnhanced()
  .then((data) => console.log("Enhanced fetch success:", data))
  .catch((error) => console.error("Enhanced fetch failed:", error.message));
