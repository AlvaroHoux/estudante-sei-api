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

-----

> **Estudante SEI API** provides a simple and type-safe way to programmatically log in and retrieve academic information from the UniRV (Universidade de Rio Verde) student portal, such as subjects, grades, and more.

-----

## ✨ Features

  - 🔐 **Secure Login**: Authenticate with your student credentials to get a session token.
  - 📚 **Fetch Subjects**: Get a detailed, parsed list of your subjects for the current academic period.
  - 🗓️ **Get Schedule**: Retrieve your class schedule.
  - 💯 **Fetch Grades**: Access your grades for each subject.
  - 🛡️ **Type-Safe**: Written entirely in TypeScript for a better and safer developer experience.
  - 🌐 **Robust Scraping**: Uses modern tools to reliably parse HTML content.

-----

## 🚀 Getting Started

To install and use the estudante-sei-api library in your project, run the following command:

```sh
npm install estudante-sei-api
```

That's it! Now you can import the functions into your project as shown in the usage example below.

-----

## 💡 How to Use

Here's a quick example of how to use the library within your project.

```typescript
import { Login, getCronograma, getNotas, MateriasPeriodoAtual } from 'estudante-sei-api';

async function main() {
  try {
    // 1. Authenticate to get the session token
    const loginResponse = await Login('YOUR_USERNAME', 'YOUR_PASSWORD');

    if (loginResponse.sucesso && loginResponse.token) {
      console.log('✅ Login successful!');
      const token = loginResponse.token;

      // 2. Use the token to fetch information
      const subjects = await MateriasPeriodoAtual(token);
      console.log('📚 Current Subjects:', subjects);

      const schedule = await getCronograma(token);
      console.log('🗓️ Schedule:', schedule);

      const grades = await getNotas(token);
      console.log('💯 Grades:', grades);

    } else {
      console.error('❌ Login failed:', loginResponse.error);
    }
  } catch (error) {
    console.error('🚨 An unexpected error occurred:', error);
  }
}

main();
```

-----

## 📖 API Reference

### `Login(username: string, password: string): Promise<RespostaLogin>`

Authenticates the user and returns a `Promise` that resolves to a login response object. On success, this object contains a `token`.

**Response `RespostaLogin`:**

```typescript
type RespostaLogin = {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  error?: string;
};
```

### `MateriasPeriodoAtual(TOKEN: string): Promise<Materia[]>`

Fetches the subjects for the current academic period using a valid session `TOKEN`.

**Response `Materia`:**

```typescript
type Materia = {
  codigo?: string;
  nomeDaMateria?: string;
  professor?: string[];
  periodoEstudoInicio?: string;
  periodoEstudoFim?: string;
  turmaPratica?: string;
  turmaTeorica?: string;
  frequencia?: number;
  status?: string;
};
```

### `getCronograma(TOKEN: string): Promise<Cronograma>`

Fetches the weekly class schedule using a valid session `TOKEN`.

**Response `Cronograma`:**

```typescript
type Cronograma = {
  Segunda: Disciplina[];
  Terça: Disciplina[];
  Quarta: Disciplina[];
  Quinta: Disciplina[];
  Sexta: Disciplina[];
  Sábado: Disciplina[];
};

type Disciplina = {
  horaInicio?: string;
  horaFim?: string;
  codigo?: string;
  nome?: string;
  turma?: string;
  professor?: string;
  sala?: string;
};
```

### `getNotas(TOKEN: string): Promise<DisciplinaNota[]>`

Fetches the grades for all subjects using a valid session `TOKEN`.

**Response `DisciplinaNota`:**

```typescript
type DisciplinaNota = {
  frequencia?: string;
  mediaFinal?: string;
  situacao?: string;
  notas?: {
    av1?: number;
    av2?: number;
    av3?: number;
  };
  codigo?: string;
  nome?: string;
  turma?: string;
};
```

> ⚠️ **Note:** All functions that require a `TOKEN` will throw an `Error` if the HTTP request fails, the token is invalid, or if there's an issue parsing the page content.

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our **Contributing Guidelines** for details on our code of conduct and the process for submitting pull requests to us.

Don't forget to ⭐ **star this repo** if you found it useful\!

-----

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AlvaroHoux/estudante-sei-api/blob/main/LICENSE) file for details.