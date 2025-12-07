/**
 * Challenge 2: The "Polite" Scraper
 * -------------------------------------------------------
 * Concept: Throttling / Sequential Requests
 *
 * Problem:
 * You have a list of user IDs: [1, 2, 3, 4, 5].
 * You must fetch each user's details from:
 *    https://jsonplaceholder.typicode.com/users/ID
 *
 * Constraint:
 * The API rate-limits strictly. Sending multiple requests
 * at once (e.g., via Promise.all) results in a ban.
 * Therefore, each request must finish before the next begins.
 *
 * Task:
 * Implement processUsersSequentially(userIds):
 *   - Accepts an array of user IDs.
 *   - Uses `for await...of` to ensure strict sequential execution.
 *   - Fetches each user's data one at a time.
 *   - Logs each user's name and email.
 * -------------------------------------------------------
 */

async function processUsersSequentially(userIds) {
  try {
    /**
     * Convert the array of IDs into an async iterable
     * so it can be consumed by `for await...of`.
     * Each ID is yielded one at a time, ensuring sequential flow.
     */
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        for (const id of userIds) {
          yield id;
        }
      },
    };

    /**
     * Process each user ID in order.
     * Each fetch must complete before moving on to the next.
     */
    for await (const id of asyncIterable) {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );

      if (!response.ok) {
        console.log(`User ${id} failed to fetch.`);
        continue; // Move to the next user rather than stopping the entire sequence
      }

      const userData = await response.json();
      console.log(`${userData.name}, ${userData.email}`);
    }
  } catch (error) {
    console.log(`Unexpected error: ${error.message}`);
  }
}

/** Execute the sequential user processing */
await processUsersSequentially([1, 2, 3, 4, 5]);
