const { XMLHttpRequest } = require("xmlhttprequest");

function get(url) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "text"; // important

    req.onload = function () {
      if (req.status === 200) {
        resolve(req.responseText || req.response); // safer access
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function () {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

// Usage:
get("http://127.0.0.1:8080/story.json").then(
  function (response) {
    console.log("Success!", response);
  },
  function (error) {
    console.error("Failed!", error);
  }
);
