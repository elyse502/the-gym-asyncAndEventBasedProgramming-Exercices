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
