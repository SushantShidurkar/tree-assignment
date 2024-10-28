# Tree Visualization Full-Stack Application

This is a full-stack application for visualizing hierarchical data in a tree structure. The application includes a Vue.js frontend and an Express.js backend. The backend serves the hierarchical data from JSON files, while the frontend fetches this data and displays it interactively.
Application uses D3.js to visualize the data and show description of selected node in a panel.

## Technologies Used

- **Frontend**: Vue.js, D3.js for data visualization, Axios for HTTP requests
- **Backend**: Node.js, Express.js for API endpoints
- **Database**: JSON files (can be adapted to other storage)
- **Testing**: Vitest for frontend Mocha, Chai, Supertest
- **TypeScript**: Used in both frontend and backend for better type safety
- **Other Tools**: ts-node, concurrently for running client and server simultaneously

## Project Structure

```
tree-visualization
├── client                  # Vue.js frontend
│   ├── public              # Static assets
│   ├── src                 # Vue components and main app code
│   └── dist                # Production build output
├── server                  # Express.js backend
│   ├── data                # JSON data files
│   └── index.ts            # Express app main entry point
├── package.json            # Main package.json for managing scripts

```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   https://github.com/SushantShidurkar/tree-assignment.git
   cd tree-assigment
   ```

2. **Install dependencies** for both frontend and backend:
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

### Running the Application

#### Development Mode

In development mode, the frontend and backend run separately to support hot-reloading.

1. **Start the Client**:
   Navigate to the `client` directory and run:
   ```bash
   cd client
   npm run dev
   ```

2. **Start the Server**:
   In the root project directory, run:
   ```bash
   npm run start
   ```

   This runs the Express server with ts-node on [http://localhost:3000](http://localhost:3000).

#### Production Mode

In production, you serve the frontend through the backend.

1. **Build the Vue.js frontend**:
   In the root project directory, run:
   ```bash
   npm run build
   ```    
    OR
   ```bash
   cd client
   npm run build
   ```

   This generates a `dist` folder inside the `client` directory.

2. **Start the Server in Production mode**:
   In the root project directory, run:
   ```bash
   npm run start
   ```

   The server will now serve the static frontend files from `client/dist` and will be available at [http://localhost:3000](http://localhost:3000).

### Testing

To run tests for the API endpoints, use:

```bash
npm run test
```

This uses Mocha, Chai, and Supertest to test the API functionality.

## Scripts

| Command            | Description                                                              |
|--------------------|--------------------------------------------------------------------------|
| `npm run dev`      | Runs the Vue client dev server separately                                |
| `npm run start`    | Runs the Express server in production mode, serving files from `dist`    |
| `npm run build`    | Builds the Vue client for production                                     |
| `npm run test`     | Runs the test suite for the server API endpoints                         |

## API Endpoints

| Method | Endpoint          | Description                             |
|--------|--------------------|-----------------------------------------|
| GET    | `/api/data/:name` | Retrieves tree data based on file name  |

### Example Request

```bash
GET /api/data/sample
```

This returns JSON data for the requested file (e.g., `tree_data_sample.json`).

## Deployment

To deploy, you can build the Vue.js app (`npm run build` in the client) and deploy the entire project to platforms like **Azure**.

1. Build the Vue app: `cd client && npm run build`
2. Deploy the project to your chosen platform.

---