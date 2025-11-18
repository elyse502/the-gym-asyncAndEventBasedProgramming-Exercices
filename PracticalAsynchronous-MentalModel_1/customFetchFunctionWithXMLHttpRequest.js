const { XMLHttpRequest } = require("xmlhttprequest");

const myFetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Set request method (default to GET)
    const method = options.method || "GET";

    xhr.open(method, url);

    // Set headers if provided
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error occurred"));
    };

    // Send request with body data for POST/PUT
    if (options.body) {
      xhr.send(JSON.stringify(options.body));
    } else {
      xhr.send();
    }
  });
};

// Example usage:
myFetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((data) => console.log(data))
  .catch((error) => console.log("Error:", error));

// POST example:
myFetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    title: "foo",
    body: "bar",
    userId: 1,
  },
});
