async function fetchUserTodosAsync(user, todo) {
  try {
    const [userRes, todoRes] = await Promise.all([fetch(user), fetch(todo)]);

    if (!userRes.ok) throw new Error("User failed to fetch");
    if (!todoRes.ok) throw new Error("Todo failed to fetch");

    const users = await userRes.json();
    const todos = await todoRes.json();

    return users.map((user) => {
      const userTodos = todos.filter((t) => user.id === t.userId);

      return {
        id: user.id,
        name: user.name,
        todo: userTodos.map((todoObj) => {
          const { userId, completed } = todoObj;

          return { userId, completed };
        }),
      };
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

const response = await fetchUserTodosAsync(
  "https://jsonplaceholder.typicode.com/users",
  "https://jsonplaceholder.typicode.com/todos"
);

console.log(response);
