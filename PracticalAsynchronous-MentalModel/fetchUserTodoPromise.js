function fetchUserTodos(user, todo) {
  const users = fetch(user).then((response) => {
    if (!response.ok) {
      throw new Error("Users Not Fetched");
    }
    return response.json();
  });
  const todos = fetch(todo).then((response) => {
    if (!response.ok) {
      throw new Error("Todos Not Fetched");
    }
    return response.json();
  });
  return Promise.all([users, todos])
    .then(([users, todos]) => {
      return users.map((user) => {
        const todo = todos.filter((t) => t.userId === user.id);

        return {
          id: user.id,
          name: user.name,
          todo: todo.map((x) => {
            const { userId, completed } = x;
            return { userId, completed };
          }),
        };
      });
    })
    .catch((error) =>
      console.log(`The following error occurred while fetching: ${error}`)
    );
}

fetchUserTodos(
  "https://jsonplaceholder.typicode.com/users",
  "https://jsonplaceholder.typicode.com/todos"
).then((result) => console.log(result));
