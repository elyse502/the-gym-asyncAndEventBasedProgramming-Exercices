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
