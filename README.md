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

There is also an [API documentation](server.md) for the development server.

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

## Design Decisions & Trade-offs

### Assumptions 
- It is mandatory for annual income tax and HEM baseline to be calculated and returned via their respective server APIs.
- Different calculator configurations are expected (i.e. different interest rate, assessment rate buffer or loan term duration).
- The calculator is intended for informational purpose only.

### Task 1: replacing placeholder functions with API calls

#### Method for making an API call

The Fetch API is used for making API calls to the server for the following reasons:

- easier to use and cleaner syntax compared to XMLHttpRequest
- doesn't introduce additional dependency like Axios

**Trade-off:**
- lacks some of the advanced features that Axios offers such as better error handling and auto-parsing of server response in JSON

#### `async/await` vs Promise

I opted to use the `async/await` syntax rather than the Promise-based approach mainly because of the better readability of its syntax. 

### Task 2: making the code maintainable

#### Server-side vs Client-side

I decided to keep the calculations for borrowing power on the client-side for the following reasons:

- Faster performance: calculations of borrowing power can be made immediately without having to make an additional API call to the server.
- Lower server workload: server does not have to handle an additional request.

**Trade-off:**
- Potential security issue: this would expose the formula of calculating power to be accessed and read by the user which could be undesirable if the formula is considered proprietary information.
- Client-side manipulation: the user can modify the formula or inputs and potentially produce different results.

#### Making the code maintainable

##### Client-side

I decided to split the original code into classes with distinct responsibilities and use runConsoleMode() in src/console_display.js as an orchestrator function to coordinate the interaction between both objects.

Classes/files and their responsibilities:
- BorrowingCalculator: focuses on the calculation of borrowing power, configurable with different loan term years/interest rate/assessment rate buffer.
- APIClient: focuses on making API calls to the server and parsing the received response.
- console_display.js: prompts and collects user inputs, orchestrates and invokes methods for each object in order, display the final results.

High-level overview of how the classes interact in runConsoleMode():
1. Get user input 
2. Instantiate both objects
3. Make API Calls with the APIClient object for annual income tax and HEM baseline cost
4. Pass the returned values along with user inputs into the calculateBorrowingPower function of BorrowingCalculator
5. Display the results 

**Reasons:**
- Clearer separation of responsibilities: code is easier to understand and modify. 
- Easier testing and maintenance: API calls and calculations for borrowing power can be tested independently.
- Enables instantiation of objects with different configurations for actual use or testing. For example, the APIClient class can be tested without the usage of real credentials.

**Trade-offs:**
- Could introduce unnecessary complexity if future features do not require different configurations of the borrowingCalculator object.
- Orchestrator function in console_display.js may become bloated or complex if more features are introduced. 

##### Server-side
- The original code is split into separate files and export relevant functions as modules to be used:
  - server.js: starts the server, authenticates incoming requests and route them to the appropriate handler.
  - api_handler.js: handles incoming requests by parsing and validating query parameters and returning the results via appropriate calculations.
  - utils.js: contains utility functions for formatting JSON responses and validating numerical query parameters.
  - calculation.js: contains functions for calculations of annual income tax and HEM baseline cost.
- In server.js, API routes are mapped to their respective handlers via a hash object.

**Reasons:**
- Clearer separation of responsibilities: code is easier to understand and modify.
- Better reusability: for example, functions from utils.js or calculation.js can be used for future API endpoints.

**Trade-offs:**
- More files to maintain/manage
- Introduces complexity in terms of understanding how requests are routed and responses are made by tracing across several modules.

### Task 3: testing the code

I wrote the following tests that can be used by future developers to ensure that their changes would not unintentionally break the existing functionalities:

- api_client.test.js
  - unit tests for the APIClient class
  - tests parsing of successful API responses and error handling for invalid or unsuccessful responses
- borrowing_calculator.test.js
  - unit tests for the BorrowingCalculator class
  - contains the original tests from the provided source code
  - tests validation and error handling when invalid parameters are provided.
- server.test.js: 
  - unit tests for the server API endpoints
  - tests expected responses when valid and invalid requests are received.
- api_client.integration.js
  - integration tests to ensure that the APIClient can make requests to the server without errors.

**Trade-off:**
- Writing and maintaining tests would require additional effort.
