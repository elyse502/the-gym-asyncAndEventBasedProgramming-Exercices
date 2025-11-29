const displayNumbers = () => {
  let count = 0;
  const startTime = Date.now();

  console.log("Starting number display....");

  const intervalId = setInterval(() => {
    count++;
    console.log(`Number ${count} at ${Date.now() - startTime}ms`);

    // Check if 5 seconds have passed
    if (Date.now() - startTime >= 5000) {
      clearInterval(intervalId);
      console.log("Stopped after 5 seconds");
    }
  }, 2000);

  // Return the interval ID in case we want to stop it early
  return intervalId;
};

// Usage
displayNumbers();
