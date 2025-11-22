# Mental Modal Session - with coach Albert

## Practicals

Qn 1. Write a JavaScript program that converts this callback-based function to a promise-based function.

```jsx
function fetchData(callback) {
  setTimeout(() => {
    const data = "Data fetched successfully!";
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(data);
  }
});
```

### Solution

```jsx
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = "Data fetched successfully!";
      resolve(data);
    }, 1000);
  });
}

fetchData()
  .then((message) => console.log(message))
  .catch((error) => console.error(error));

# Other example
const fetchData = async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();
    console.log(data);

    console.log("\n\n- Name:", data.name);
  } catch (error) {
    console.log(error);
  }
};

fetchData();

```

---

Qn 2. Implement Async Await version of the above implemented function

### Solution

```jsx
const fetchDataPromisified = (shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail === true) {
        reject(new Error("promise failed"));
      } else {
        const data = "Data fetched successfully!";
        resolve(data);
      }
    }, 1000);
  });
};

async function testSuccess() {
  try {
    console.log("w1");
    const data = await fetchDataPromisified(false);
    console.log("w2");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// failure
async function testFailure() {
  try {
    const data = await fetchDataPromisified(true);
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

console.log("last last");
// Run both tests
testSuccess();

console.log("break or breakin'...");
// testFailure();
```

---

Qn 3. Same approach like the above one but with different scenario:

```jsx
function callback_BasedFunction(arg1, arg2, callback) {
  // Perform asynchronous operations
  // Call the callback with the result or error
  setTimeout(() => {
    const result = arg1 + arg2;
    if (result % 2 !== 0) {
      callback(null, result);
    } else {
      callback(new Error("Result is not odd!"), null);
    }
  }, 1000);
}
```

### Solution

```jsx
function solution(arg1, arg2) {
  return new Promise((resolve, reject) => {
    const result = arg1 + arg2;
    setTimeout(() => {
      if (result % 2 !== 0) resolve(result);
      else reject(new Error("Result is not odd"));
    }, 1000);
  });
}
solution(3, 3)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

---

Qn 4. Write a JavaScript function that takes an array of URLs and downloads the contents of each URL in parallel using Promises.

```jsx
// Usage example:
const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
];
```

### Solution

```jsx
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
```

---

Qn 5. Create a function called fetchUserTodos that uses the Promise.all() method to fetch users and todos concurrently from the provided API endpoints and combine them based on the userId. The function should return a promise that resolves with the combined data.

- Users endpoints [`https://jsonplaceholder.typicode.com/users`](https://jsonplaceholder.typicode.com/users)
- Todos endpoints [`https://jsonplaceholder.typicode.com/todos`](https://jsonplaceholder.typicode.com/todos)

The returned promise should resolve into an array of users, where each user object has a new key todos. This key should contain an array of todos that belong to the user, determined by matching the userId of the todo with the id of the user. User objects may look like.

Expected result to print:

```jsx
// User object may look like
  {
      id: 10,
    name: 'Clementina DuBuque',
    ...
  }

  // Todo object may look like
  {
      userId: 5,
    completed: false,
      ...
  }

  // The result array will have objects that look like

  {
      id: 10,
    name: 'Clementina DuBuque',
    todos: [
          {
              userId: 10,
            completed: false,
              ...
          },
          {
              userId: 10,
            completed: false,
              ...
          }
      ]
      ...
  }
```

### Solution

```jsx
async function fetchUserTodos() {
  try {
    const [usersRes, todosRes] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/users"),
      fetch("https://jsonplaceholder.typicode.com/todos"),
    ]);

    if (!usersRes.ok || !todosRes.ok) {
      throw new Error(
        `HTTP error! users: ${usersRes.status}, todos: ${todosRes.status}`
      );
    }

    const [users, todos] = await Promise.all([
      usersRes.json(),
      todosRes.json(),
    ]);

    const combined = users.map(({ id, name }) => ({
      id,
      name,
      todos: todos.filter((todo) => todo.userId === id),
    }));

    combined.forEach(({ id, name, todos }) => {
      console.log(`User ${id}: ${name} - ${todos.length} todos`);
    });

    return combined;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  }
}

// Usage
fetchUserTodos()
  .then((data) => console.log("\n\nSuccess:", data))
  .catch((error) => console.error("\n\nFailure:", error.message));
```

Qn 6. Create a function called `getFastPosts`that fetches posts from multiple endpoints simultaneously and returns data from the fastest source.

```jsx
const apiUrls = [
  "https://jsonplaceholder.typicode.com/posts/4",
  "https://jsonplaceholder.typicode.com/posts/5",
  "https://jsonplaceholder.typicode.com/posts/6",
];
```

### Solution

```jsx
async function getFastPosts(apiUrls) {
  try {
    // Create fetch promises for all URLs
    const fetchPromises = apiUrls.map((url) =>
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    );

    // Return the first one that resolves (fastest)
    const fastestData = await Promise.race(fetchPromises);
    return fastestData;
  } catch (error) {
    console.error("All requests failed:", error.message);
    throw error;
  }
}

// Usage example:
const apiUrls = [
  "https://jsonplaceholder.typicode.com/posts/4",
  "https://jsonplaceholder.typicode.com/posts/5",
  "https://jsonplaceholder.typicode.com/posts/6",
];

getFastPosts(apiUrls)
  .then((fastestPost) => {
    console.log("Fastest post received:", fastestPost);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

---

Qn 7. You are building a web application that fetches data from multiple APIs to display information about different countries. You need to fetch the country details from one API and the weather information for the capital city from another API.

**Here are the requirements:**

- Use the fetch API to get the country details from [https://restcountries.com/v3.1/name/{countryName}](https://restcountries.com/v3.1/name/%7BcountryName%7D).
- Use the fetch API to get the weather details from [https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true](https://api.open-meteo.com/v1/forecast?latitude=%7Blat%7D&longitude=%7Blon%7D&current_weather=true).
- The weather API requires the latitude and longitude of the capital city, which you will get from the country details.
- Display the country's name, capital city, and current temperature in the console.

**Example:**

If the user searches for "France", your application should:

- Fetch country details from https://restcountries.com/v3.1/name/France.
- Extract the capital city and its coordinates (latitude and longitude).
- Fetch the current weather for the capital city from the weather API.

**Display the results in the console as follows:**

```jsx
Country: France
Capital: Paris
Current Temperature: 18°C
```

### Solution

```jsx
async function getCountryWeather(countryName) {
  try {
    // Step 1: Fetch country details
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (!countryResponse.ok) {
      throw new Error("Country not found");
    }

    const countryData = await countryResponse.json();
    const country = countryData[0];

    // Extract country information
    const name = country.name.common;
    const capital = country.capital[0];
    const lat = country.capitalInfo.latlng[0];
    const lon = country.capitalInfo.latlng[1];

    // Step 2: Fetch weather data using coordinates
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather data unavailable");
    }

    const weatherData = await weatherResponse.json();
    const temperature = weatherData.current_weather.temperature;

    // Step 3: Display results
    console.log("Country:", name);
    console.log("Capital:", capital);
    console.log("Current Temperature:", temperature + "°C");

    return { name, capital, temperature };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Usage example:
getCountryWeather("Rwanda")
  .then((result) => {
    console.log("\nSuccess! Data retrieved:", result);
  })
  .catch((error) => {
    console.log("Failed to get data");
  });
```

---

Qn 8. Create a function called myFetch that should work as a simple version of the native fetch() API. The function myFetch should use the XMLHttpRequest to make a GET Request and return a promise that resolves with the request's response and rejects with an error if any.

// Usage Example

```jsx
function myFetch() {
  //... your code here
}

myFetch("https://jsonplaceholder.typicode.com/users")
  .then((data) => console.log(data))
  .catch((error) => console.log("Error:", error));
```

### Solution

```jsx
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
```

---

Qn 9. Create a button that counts clicks, but with a twist - after each click, the button should be disabled for 2 seconds while showing "Processing..." text. Once the delay is over, re-enable the button and show the updated count. This tests your ability to manage UI state during async operations triggered by user interactions.

```
Requirements:

- Button shows "Click me! Count: 0" initially
- When clicked, immediately show "Processing..." and disable button
- After 2 seconds, re-enable button and show new count
- Handle multiple rapid clicks properly (they should queue or be ignored)
```

### Solution

```jsx
<!DOCTYPE html>
<html>
  <title>Click Counter</title>
  <body>
    <button id="clickBtn" onclick="handleClick()">Click me! Count: 0</button>

    <script>
      let count = 0;
      let isBusy = false;

      function handleClick() {
        if (isBusy) return;

        const btn = document.getElementById("clickBtn");
        btn.disabled = true;
        btn.textContent = "Processing...";
        isBusy = true;

        setTimeout(() => {
          count++;
          btn.textContent = `Click me! Count: ${count}`;
          btn.disabled = false;
          isBusy = false;
        }, 2000);
      }
    </script>
  </body>
</html>

```

---

Qn 10. Implement a timeout for an asynchronous fetch request. If the request takes longer than 3 milliseconds, it should be aborted.

```jsx
https://restcountries.eu/rest/v2/all
```

### Solution

```jsx
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

// Usage
fetchWithTimeoutRace("https://restcountries.com/v3.1/all", 3)
  .then((countries) => {
    console.log(`Fetched ${countries.length} countries`);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

---

## Theory

Qn 1. When does try and catch captures errors and when does it not?

### Solution

In programming, particularly in languages like Java, C#, JavaScript, and Python, `try` and `catch` blocks (or equivalent error handling constructs) are used to handle exceptions or errors that may arise during runtime. However, there are situations where `try`/`catch` will or will not catch errors. Here's a breakdown of when they do and don’t capture errors:

### **When `try` and `catch` will capture errors:**

1. **Exceptions thrown within the `try` block:**

   If an exception (or error) occurs inside the `try` block, it will be caught by the corresponding `catch` block. For example, in JavaScript:

   ```jsx
   try {
     let result = riskyFunction();
   } catch (error) {
     console.log("An error occurred:", error);
   }
   ```

   In this case, if `riskyFunction()` throws an error, it will be caught by the `catch` block.

2. **Synchronous errors:**

   If the error occurs during synchronous code execution in the `try` block, it will be caught by the `catch` block. For example:

   ```jsx
   try {
     let x = 10 / 0; // This will cause an exception in JavaScript, typically Infinity or an error in other languages
   } catch (error) {
     console.log("Error caught:", error);
   }
   ```

   In JavaScript, `10 / 0` doesn’t throw an exception, but in other languages, division by zero may throw an error.

3. **Errors thrown explicitly using `throw`:**

   If an error is explicitly thrown using the `throw` keyword, the `catch` block will capture it. For example:

   ```jsx
   try {
     throw new Error("Something went wrong");
   } catch (error) {
     console.log("Caught error:", error.message);
   }
   ```

### **When `try` and `catch` will NOT capture errors:**

1. **Asynchronous errors:**

   In many languages (like JavaScript), asynchronous errors (e.g., from Promises, `setTimeout`, etc.) are **not** automatically caught by `try`/`catch`. This is because the error happens in a different execution context (outside the `try` block).

   Example (JavaScript):

   ```jsx
   try {
     setTimeout(() => {
       throw new Error("Async error");
     }, 1000);
   } catch (error) {
     console.log("This will NOT catch the async error");
   }
   ```

   In this case, the error inside `setTimeout` will not be caught by the `try`/`catch`. You would need to use `.catch()` or handle errors in the async context itself:

   ```jsx
   setTimeout(() => {
     try {
       throw new Error("Async error");
     } catch (error) {
       console.log("Caught async error:", error);
     }
   }, 1000);
   ```

   Or, with Promises:

   ```jsx
   Promise.reject(new Error("Async Promise error")).catch((error) =>
     console.log("Caught promise error:", error)
   );
   ```

2. **Errors outside the `try` block (e.g., initialization errors):**

   If an error occurs before the `try` block begins execution (e.g., a syntax error or an error in initialization), the `catch` block will not handle it. For example:

   ```jsx
   try {
     let result = riskyFunction();
   } catch (error) {
     console.log("This won't catch if `riskyFunction` is not defined before");
   }
   ```

   If `riskyFunction` is not defined at all, it would result in a **ReferenceError**, which would not be caught by the `try`/`catch` unless the code is properly set up to handle that.

3. **Unhandled errors from non-throwing functions:**

   If a function doesn't throw an error (even if something goes wrong), it won’t be caught by `try`/`catch`. For example:

   ```jsx
   try {
     let result = someFunctionThatDoesNotThrowErrors();
   } catch (error) {
     console.log("Error caught:", error); // This won't run
   }
   ```

   If `someFunctionThatDoesNotThrowErrors()` doesn't throw, no error will be caught.

4. **Out-of-scope errors (e.g., global errors):**

   Global errors or those outside the scope of the `try` block might not be caught by it. For example, in some cases, errors that are triggered globally in JavaScript (like unhandled `uncaughtException` events) are outside of the `try/catch` scope.

---

### Summary

- `try` and `catch` **will** capture synchronous errors or exceptions that occur **within** the `try` block, including those thrown explicitly with `throw`.
- **Asynchronous errors** (e.g., from Promises, `setTimeout`, or `async` functions) are not automatically caught by `try`/`catch` unless the error is explicitly handled within the async operation.
- Syntax errors or initialization errors before the `try` block will not be caught by it.
- The `catch` block will only handle errors thrown inside the `try` block or any errors explicitly thrown.

Let me know if you need further clarification or examples for a specific language!
