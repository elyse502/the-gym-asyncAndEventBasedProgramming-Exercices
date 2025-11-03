# 🌐 Promisifying XMLHttpRequest (JavaScript Async Exercise)

This mini-project demonstrates how to **promisify an XMLHttpRequest (XHR)** in JavaScript to handle asynchronous HTTP requests using **Promises** instead of callbacks.

It’s a simple educational exercise showing how to manually fetch and handle data (like a JSON file) using Promises — helping you better understand async programming in JavaScript.

---

## 📁 Project Structure

```groovy

Promisifying-XMLHttpRequest/
├── node_modules/
├── .eslintrc.js
├── babel.config.js
├── getRequest.js
├── story.json
├── package.json
├── package-lock.json
└── README.md

```

---

## ⚙️ Requirements

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/en/download) installed
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A simple **local HTTP server** (e.g. `npx http-server`, Python’s `http.server`, or VSCode’s Live Server)

---

## 📦 Installation

1. **Clone or download this repository**
   ```console
   git clone https://github.com/elyse502/the-gym-asyncAndEventBasedProgramming-Exercices.git
   cd Promisifying-XMLHttpRequest
   ```

---

2. **Install dependencies**

   ```console
   cd Promisifying-XMLHttpRequest
   npm install
   ```

---

## 🧠 What This Project Does

- Uses the `xmlhttprequest` package to create a `GET` request
- Wraps the request logic inside a `Promise`
- Handles both **success** and **failure** cases with `.then()` and `.catch()` (or second `.then()` parameter)
- Reads a sample JSON file (`story.json`)

---

## 🚀 Running the Program

### 1️⃣ Start a local server

You can use any lightweight HTTP server to serve `story.json`.
For example, with Node.js installed, run:

```console
npx http-server .
```

You’ll see something like:

```console
Serving files from ./
Available on:
  http://127.0.0.1:8080
```

---

### 2️⃣ Run the script

In another terminal, execute:

```console
npm run dev getRequest.js
```

If successful, you’ll see something like:

```
Success! {
  "title": "The Curious Developer",
  "author": "Elysée Niyibizi",
  "story": "Once upon a time, a developer decided to master JavaScript Promises..."
}
```

---

## 🧩 Example Code (getRequest.js)

```js
const { XMLHttpRequest } = require("xmlhttprequest");

function get(url) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "text";

    req.onload = function () {
      if (req.status === 200) {
        resolve(JSON.parse(req.responseText || req.response));
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

get("http://127.0.0.1:8080/story.json").then(
  function (response) {
    console.log("Success!", response);
  },
  function (error) {
    console.error("Failed!", error);
  }
);
```

---

## 📚 Example `story.json`

```json
{
  "title": "The Curious Developer",
  "author": "Elysée Niyibizi",
  "story": "Once upon a time, a developer decided to master JavaScript Promises..."
}
```

---

## 🧠 Key Concepts Covered

- Asynchronous programming in JavaScript
- Promises (`resolve`, `reject`, `.then`, `.catch`)
- Using **XMLHttpRequest** with Promises
- Reading and handling **JSON** data from a server

---

## 🐛 Common Errors & Fixes

| Error                           | Cause                        | Solution                        |
| ------------------------------- | ---------------------------- | ------------------------------- |
| `Network Error`                 | No local server running      | Run `npx http-server .`         |
| `Success! undefined`            | Missing or empty response    | Add `req.responseType = "text"` |
| `SyntaxError: Unexpected token` | Invalid JSON in `story.json` | Ensure valid JSON format        |

---

## 👨‍💻 Author

**Elysée Niyibizi**
Aspiring Software Engineer | JavaScript Enthusiast
📍 Kigali, Rwanda

---

## 🪄 License

This project is for educational purposes and open to all learners. Feel free to modify, extend, or reuse it for practice.

---
