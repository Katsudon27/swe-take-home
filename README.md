# Ferocia Junior Engineering Code Exercise
Hi there! This is my submission for the code exercise which extends upon the provided source code for a borrowing power calculator. My submission covers the following tasks:
- replacing placeholder functions with API calls
- refactoring the source code for better maintainability
- ensuring the refactored source code pass tests with full coverage

## Getting Started

### Prerequisites
You should have the following installed on your machine:
- Node.js and the npm command line interface 
- Git

If not, check out these guides from their respective official documentations: 
- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Git](https://git-scm.com/install/)

### Installation
1. Clone the repository onto your local machine.
    ```sh
    git clone https://github.com/Katsudon27/swe-take-home.git
    ```
2. Install the required dependencies in the directory you used in step 1.
    ```sh
    npm install
    ```
3. Duplicate the `.env.sample` file and rename it to `.env`.
4. Add a valid PAT (personal access token) to the `.env` file so it would look something like:
    ```.env
    VALID_PAT = pat_123
    SERVER_URL = http://localhost:3000
    ```

## Usage

*Commands marked with * should be executed with the server running in a separate terminal window.*

### Server

You can run the server with the following command:
```sh
npm run api
```

*Note: you can stop the server with CTRL + C.*

### Running

You can run the calculator with the following command*:

```sh
npm start
```

### Testing

You can run the unit tests for the **client-side** with the following command:

```sh
npm run test:client_unit
```

You can run the unit tests for the **server** with the following command:

```sh
npm run test:server_unit
```

You can run the **integration** tests with the following command*:

```sh
npm run test:integration
```

You can run **all** tests together with the following command*:

```sh
npm test
```
