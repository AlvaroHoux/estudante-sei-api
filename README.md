# 🎓 Estudante SEI API

**An unofficial, robust TypeScript library to interact with the UniRV SEI student portal.**

<p align="center">
  <a href="https://github.com/AlvaroHoux/estudante-sei-api/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/AlvaroHoux/estudante-sei-api/ci.yml?style=for-the-badge&logo=github&label=Build" alt="build status" />
  </a>
  <a href="https://github.com/AlvaroHoux/estudante-sei-api/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/AlvaroHoux/estudante-sei-api?style=for-the-badge" alt="license" />
  </a>
   <img src="https://img.shields.io/github/languages/top/AlvaroHoux/estudante-sei-api?style=for-the-badge&logo=typescript" alt="primary language" />
</p>

---

> **Estudante SEI API** provides a simple and type-safe way to programmatically log in and retrieve academic information from the UniRV (Universidade de Rio Verde) student portal, such as subjects, grades, and more.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [💡 How to Use](#-how-to-use)
- [👨‍💻 Running the Tests](#-running-the-tests)
- [📖 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

-   🔐 **Secure Login**: Authenticate with your student credentials to get a session token.
-   📚 **Fetch Subjects**: Get a detailed, parsed list of your subjects for the current academic period.
-   🛡️ **Type-Safe**: Written entirely in TypeScript for a better and safer developer experience.
-   🌐 **Robust Scraping**: Uses modern tools to reliably parse HTML content.

---

## 🛠️ Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) - `v18.x` or higher
-   [Yarn](https://yarnpkg.com/) (recommended) or `npm`

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

1.  Clone the repository:
    ```sh
    git clone https://github.com/AlvaroHoux/estudante-sei-api.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd estudante-sei-api
    ```
3.  Install dependencies:
    ```sh
    yarn install
    ```
    or
    ```sh
    npm install
    ```

---

## 💡 How to Use

Here's a quick example of how to use the library within the project.

```typescript
// Adjust the import path based on your project structure
import { Login, MateriasPeriodoAtual } from './src/index'; 

async function getMySubjects() {
  try {
    // 1. Authenticate to get the session token
    const loginResponse = await Login('YOUR_USERNAME', 'YOUR_PASSWORD');

    if (loginResponse.sucesso && loginResponse.token) {
      console.log('✅ Login successful!');

      // 2. Use the token to fetch the subjects
      const subjects = await MateriasPeriodoAtual(loginResponse.token);

      console.log('📚 Current Subjects:');
      console.log(subjects);

    } else {
      console.error('❌ Login failed:', loginResponse.error);
    }
  } catch (error) {
    console.error('🚨 An unexpected error occurred:', error);
  }
}

getMySubjects();
```

### Example Output
```json
[
  {
    "codigo": "12345 - ABC",
    "nomeDaMateria": "INTRODUCTION TO PROGRAMMING",
    "professor": [ "John Doe" ],
    "turmaPratica": "A",
    "turmaTeorica": "A",
    "frequencia": 95.5,
    "periodoEstudoInicio": "01/01/2024",
    "periodoEstudoFim": "30/06/2024",
    "status": "In progress"
  }
]
```

---

## 👨‍💻 Running the Tests

To run the test suite, you first need to set up your credentials.

1.  Create a `.env` file in the root of the project.
2.  Add your test credentials to the `.env` file:
    ```env
    APP_USERNAME="your-test-username"
    APP_PASSWORD="your-test-password"
    ```
3.  Run the tests using the following command:
    ```sh
    yarn test
    ```
    or
    ```sh
    npm test
    ```

---

## 📖 API Reference

### `Login(username: string, password: string): Promise<RespostaLogin>`
Authenticates the user and returns a `Promise` that resolves to a login response object. On success, this object contains a `token`.

### `MateriasPeriodoAtual(TOKEN: string): Promise<Materia[]>`
Fetches the subjects for the current academic period using a valid session `TOKEN` (JSESSIONID).

> ⚠️ **Note:** This function will throw an `Error` if the HTTP request fails, the token is invalid, or if there's an issue parsing the page content.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our **Contributing Guidelines** for details on our code of conduct and the process for submitting pull requests to us.

Don't forget to ⭐ **star this repo** if you found it useful!

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AlvaroHoux/estudante-sei-api/blob/main/LICENSE) file for details.