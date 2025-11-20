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
