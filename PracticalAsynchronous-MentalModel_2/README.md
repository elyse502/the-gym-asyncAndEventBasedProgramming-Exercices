# Practical JavaScript exercises (Asynchronous & Event-Based Programming)

1. Write a function that takes a URL and fetches data from that URL but aborts when the request takes more than 10ms
2. Write a javascript function that displays a number every two seconds and stops displaying after 5 seconds
3. Write a JavaScript function that fetches data from an API and retries the request a specified number of times if it fails. Wrap a promise around it.
4. Write a JavaScript function `fetchToDo` that uses XMLHttpRequest to fetch data from the given URL (https://jsonplaceholder.typicode.com/todos/1). The function should handle both successful responses and errors (such as network issues or invalid URLs). Upon receiving a successful response, it should log the fetched data to the console. If there's an error, it should catch the error and log an appropriate message.
5. Extend the `fetchToDo` function from Question 4 to include custom headers in the request. Specifically, you need to add a User-Agent header with a custom value and a Content-Type header set to application/json. Additionally, modify the function to send a JSON payload in the request body. After sending the request, the function should parse the JSON response and log the parsed object to the console.

## What is the output of the following code snippets?

```jsx
// Promise Chain

const promise = new Promise((resolve, reject) => {
  console.log("Promise created");
  resolve("First resolve");
});

promise
  .then((result) => {
    console.log(result);
    return "Second resolve";
  })
  .then((result) => {
    console.log(result);
    throw new Error("Error in chain");
  })
  .catch((error) => {
    console.error("Caught:", error.message);
  })
  .then(() => {
    console.log("After catch");
  });
```

```jsx
// Async/Await with Promises

async function asyncFunction() {
  console.log("Inside async function");
  return "Async Function Result";
}

console.log("Start");

asyncFunction().then((result) => {
  console.log(result);
});

console.log("End");
```

```jsx
// Nested promises

Promise.resolve("Outer Promise")
  .then((result) => {
    console.log(result);
    return new Promise((resolve, reject) => {
      console.log("Inner Promise created");
      resolve("Inner Promise");
    });
  })
  .then((result) => {
    console.log(result);
  });
```

```jsx
console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("promise 1");
  });
}, 0);

new Promise(function (resolve, reject) {
  console.log("promise 2");
  setTimeout(function () {
    console.log("setTimeout 2");
    resolve("resolve 1");
  }, 0);
}).then((res) => {
  console.log("dot then 1");
  setTimeout(() => {
    console.log(res);
  }, 0);
});
```

```jsx
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Promise 2");
      }, 0);
    });
  })
  .then((result) => {
    console.log(result);
  });

console.log("End");
```

<br /><hr /><br />

<h1 align="center">Answers</h1>

## 1. Fetch with Timeout (10ms)

```javascript
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

// Note: 10ms is extremely short - for real use, use 5000ms (5 seconds)
```

## 2. Display Number Every 2 Seconds for 5 Seconds

```javascript
function displayNumbers() {
  let count = 0;
  const startTime = Date.now();

  console.log("Starting number display...");

  const intervalId = setInterval(() => {
    count++;
    console.log(`Number ${count} at ${Date.now() - startTime}ms`);

    // Check if 5 seconds have passed
    if (Date.now() - startTime >= 5000) {
      clearInterval(intervalId);
      console.log("Stopped after 5 seconds");
    }
  }, 2000);

  // Return the interval ID in case we need to stop it early
  return intervalId;
}

// Enhanced version with cleanup
function displayNumbersSafe() {
  let count = 0;
  const startTime = Date.now();
  let intervalId = null;

  try {
    console.log("Starting number display...");

    intervalId = setInterval(() => {
      try {
        count++;
        const elapsed = Date.now() - startTime;
        console.log(`Number ${count} at ${elapsed}ms`);

        if (elapsed >= 5000) {
          clearInterval(intervalId);
          console.log("✅ Completed: Displayed numbers for 5 seconds");
        }
      } catch (error) {
        console.error("Error in interval callback:", error);
        clearInterval(intervalId);
      }
    }, 2000);
  } catch (error) {
    console.error("Failed to start interval:", error);
    if (intervalId) clearInterval(intervalId);
  }

  return intervalId;
}

// Usage
displayNumbersSafe();

// To stop manually (if needed):
// const timer = displayNumbersSafe();
// setTimeout(() => clearInterval(timer), 3000); // Stop early
```

## 3. Fetch with Retry Logic

```javascript
async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Success on attempt ${attempt}`);
      return data;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error(
    `All ${maxRetries} attempts failed. Last error: ${lastError.message}`
  );
}

// Promise wrapper version
function fetchWithRetryPromise(url, maxRetries = 3) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fetchWithRetry(url, maxRetries);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Usage examples
fetchWithRetry("https://jsonplaceholder.typicode.com/posts/1", 3)
  .then((data) => console.log("Final success:", data))
  .catch((error) => console.error("Final failure:", error.message));

// Using the promise wrapper
fetchWithRetryPromise("https://jsonplaceholder.typicode.com/todos/1")
  .then((data) => console.log("Todo:", data))
  .catch((error) => console.error("Failed:", error.message));
```

## 4. Fetch with XMLHttpRequest (Basic)

```javascript
function fetchToDo(url = "https://jsonplaceholder.typicode.com/todos/1") {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.timeout = 10000; // 10 second timeout

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log("✅ Success:", data);
          resolve(data);
        } catch (parseError) {
          const error = new Error(
            `Failed to parse JSON: ${parseError.message}`
          );
          console.error("❌", error.message);
          reject(error);
        }
      } else {
        const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
        console.error("❌", error.message);
        reject(error);
      }
    };

    xhr.onerror = function () {
      const error = new Error("Network error occurred");
      console.error("❌", error.message);
      reject(error);
    };

    xhr.ontimeout = function () {
      const error = new Error("Request timeout after 10 seconds");
      console.error("❌", error.message);
      reject(error);
    };

    try {
      xhr.send();
    } catch (error) {
      console.error("❌ Failed to send request:", error.message);
      reject(error);
    }
  });
}

// Usage with error handling
fetchToDo()
  .then((data) => console.log("Received todo:", data))
  .catch((error) => console.error("Final error:", error.message));

// Test with invalid URL
fetchToDo("https://invalid-url-that-does-not-exist.com")
  .then((data) => console.log("This should not run"))
  .catch((error) => console.error("Expected error:", error.message));
```

## 5. Enhanced Fetch with Headers and JSON Body

```javascript
function fetchToDoEnhanced(
  url = "https://jsonplaceholder.typicode.com/todos/1",
  method = "GET",
  payload = null
) {
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
            console.log("✅ Empty response received");
            resolve(null);
            return;
          }

          const data = JSON.parse(responseText);
          console.log("✅ Success with headers:", {
            status: xhr.status,
            contentType: xhr.getResponseHeader("Content-Type"),
            data: data,
          });
          resolve(data);
        } else {
          throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
        }
      } catch (error) {
        console.error("❌ Response handling failed:", error.message);
        reject(error);
      }
    };

    xhr.onerror = function () {
      const error = new Error("Network error - check URL and connection");
      console.error("❌", error.message);
      reject(error);
    };

    xhr.ontimeout = function () {
      const error = new Error("Request timeout after 10 seconds");
      console.error("❌", error.message);
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
      console.error("❌ Failed to send request:", error.message);
      reject(error);
    }
  });
}

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
```

## Key Error Handling Features:

1. **Timeout Protection**: All functions include timeout handling
2. **Network Error Detection**: Properly catches network failures
3. **HTTP Status Validation**: Checks for 200-299 status codes
4. **JSON Parsing Safety**: Wraps JSON.parse in try/catch
5. **Cleanup**: Properly clears timeouts and intervals
6. **Descriptive Errors**: Meaningful error messages for debugging
7. **Graceful Degradation**: Functions don't crash on errors

<br /><hr /><br />

# The outputs for each code snippet with explanations:

## 1. Promise Chain

**Output:**

```
Promise created
First resolve
Second resolve
Caught: Error in chain
After catch

```

**Explanation:**

- `Promise created` logs immediately when promise is constructed
- First `.then()` receives `'First resolve'` and returns `'Second resolve'`
- Second `.then()` receives `'Second resolve'` but throws an error
- `.catch()` catches the error and logs the message
- Final `.then()` executes after catch since catch doesn't throw

## 2. Async/Await with Promises

**Output:**

```
Start
Inside async function
End
Async Function Result

```

**Explanation:**

- `Start` logs first (synchronous)
- `asyncFunction()` starts executing, logs `Inside async function`
- Function returns a promise, but `.then()` callback goes to microtask queue
- `End` logs next (synchronous)
- Microtask executes: `Async Function Result` logs from `.then()`

## 3. Nested Promises

**Output:**

```
Outer Promise
Inner Promise created
Inner Promise

```

**Explanation:**

- First `.then()` receives `'Outer Promise'` and logs it
- Returns a new promise that immediately logs `'Inner Promise created'` and resolves
- Second `.then()` waits for the inner promise to resolve, then logs `'Inner Promise'`

## 4. Complex Event Loop

**Output:**

```
Start
promise 2
setTimeout 1
promise 1
setTimeout 2
dot then 1
resolve 1

```

**Step-by-step execution:**

1. `Start` (sync)
2. `promise 2` (sync - inside promise executor)
3. **Macrotask queue:** `setTimeout 1`, `setTimeout 2`
4. **First macrotask:** `setTimeout 1` executes
   - Logs `setTimeout 1`
   - Adds `promise 1` to microtask queue
5. **Microtask queue processed:** `promise 1` executes
6. **Next macrotask:** `setTimeout 2` executes
   - Logs `setTimeout 2`
   - Resolves promise, adding `dot then 1` to microtask queue
7. **Microtask queue processed:** `dot then 1` executes
   - Schedules another setTimeout
8. **Final macrotask:** `resolve 1` executes

## 5. Nested Async Operations

**Output:**

```
Start
End
Promise 1
Timeout
Promise 2

```

**Step-by-step execution:**

1. `Start` (sync)
2. `setTimeout` callback goes to macrotask queue
3. `Promise.resolve().then()` goes to microtask queue
4. `End` (sync)
5. **Microtask executes:** `Promise 1` logs
   - Returns new promise with setTimeout, so chain pauses
6. **Macrotask executes:** `Timeout` logs (from original setTimeout)
7. **Inner setTimeout resolves:** Promise resolves with `'Promise 2'`
8. **Final `.then()` executes:** `Promise 2` logs

## Key Takeaways:

1. **Sync code always runs first**
2. **Microtasks (Promises) execute before Macrotasks (setTimeout)**
3. **Promise constructors run synchronously**
4. **Each `.then()` creates a new microtask**
5. **Event loop processes all microtasks before next macrotask**

The order demonstrates JavaScript's single-threaded nature with the event loop prioritizing microtasks over macrotasks! 🔄
