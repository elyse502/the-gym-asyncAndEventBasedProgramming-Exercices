/**
 * Fetches users and todos concurrently from the provided API endpoints
 * and combines them based on userId.
 *
 * @returns {Promise<Array>} A promise that resolves with an array of users,
 * each containing their respective todos.
 */
async function fetchUserTodos() {
  const urls = [
    `https://jsonplaceholder.typicode.com/users`,
    `https://jsonplaceholder.typicode.com/todos`,
  ];

  try {
    // Fetch users and todos concurrently using Promise.all
    const [users, todos] = await Promise.all(
      urls.map((url) => fetch(url).then((res) => res.json()))
    );

    // Combine users and todos based on userId
    const usersWithTodos = users.map((user) => ({
      ...user, // Spread user data
      todos: todos.filter((todo) => todo.userId === user.id), // Filter todos by matching userId
    }));

    return usersWithTodos; // Return the combined data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch users and todos");
  }
}

// Example usage
fetchUserTodos()
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
