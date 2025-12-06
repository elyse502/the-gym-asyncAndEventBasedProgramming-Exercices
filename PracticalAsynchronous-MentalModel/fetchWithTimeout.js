/**
 * 
 * Implement a timeout for an asynchronous fetch request. If the request takes longer than(5 milliseconds) , it should be aborted.

    https://jsonplaceholder.typicode.com/users
 * 
 * @param {*} url 
 * @param {*} timeout 
 * @returns {Promise<void>}
 */

async function fetchWithTimeout(url, timeout = 5) {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set up a timeout to abort the fetch if it takes longer than the specified time
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, { signal });

    // Clear the timeout if the request finishes before the timeout
    clearTimeout(timeoutId);

    // If the request was successful, parse the JSON response
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    // Handle errors, including abort errors
    if (error.name === "AbortError") {
      console.error("Request timed out");
    } else {
      console.error("Fetch error:", error);
    }
  }
}

// URL to fetch data
const url = "https://jsonplaceholder.typicode.com/users";

// Call the function with a 5 ms timeout
fetchWithTimeout(url, 5);

/**
 * Explanation:

 * AbortController: This is used to create an abort signal that can be passed to the fetch request. If the request takes longer than the timeout (5 milliseconds in this case), the controller will abort the request.

 * Timeout: We set a timeout using setTimeout(). If the fetch request takes longer than 5 milliseconds, the controller.abort() method will be called, terminating the request.

 * Clear Timeout: If the fetch request completes successfully before the timeout, we clear the timeout using clearTimeout().

Error Handling: If the request is aborted or if there's any error, the catch block will handle it. If it's an abort error (AbortError), we print that the request timed out.

 * Why the Timeout Might Not Work:

 * 5 milliseconds is an extremely short timeout for an HTTP request, especially when it involves a remote server. In practice, this timeout would almost always lead to an abortion of the request.

 * Ensure that the server you're making the request to is responsive enough to handle a 5-millisecond window, or consider increasing the timeout if you're trying this in a real-world scenario.

 * Notes:
 * This approach can be very useful for controlling how long your application will wait for a server response, especially when working with unreliable or slow networks.
 */
