# Goose and Academic Predator

### Introduction

Goose and Academic Predator is a web-based educational game prototype developed as part of a research project exploring game-based approaches to raising awareness of predatory academic publishing.

The game provides an interactive browser environment in which players engage with concepts relating to academic publishing practices through a dice-based goose game environment.

### Live Demo

A hosted demo is available at:

**[Live Demo](https://goose-and-academic-predator.vercel.app/)**

The codebase is hosted on github at:

**[Goose and Academic Predator GitHub](https://github.com/kkhtun/goose-and-academic-predator)**

### Project Structure

```text
goose-and-academic-predator/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend
├── .gitignore
└── README.md
```

### Prerequisites

- Node.js > 22
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/kkhtun/goose-and-academic-predator
cd goose-and-academic-predator
```

Install dependencies for both the server and client:

```bash
cd server
npm install
cd ../client
npm install
```

### Running Locally

Start the backend server:

```bash
cd server
npm run dev
```

In a separate terminal, start the frontend:

```bash
cd client
npm run dev
```

Both applications must be running for the game to function. Once both the client and server are running, the game can typically be accessed at [http://localhost:5173/](http://localhost:5173/).

Additional package resolution or configuration may be required. Please refer to the relevant package.json files.

### License

The source code is licensed under the MIT License.
See [LICENSE](LICENSE) for details.

### Citation

The source code for Goose and Academic Predator is archived on Zenodo.

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24257394.svg)](https://doi.org/10.5281/zenodo.24257394)
