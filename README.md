# IUT Bureau of Felines

The **IUT Bureau of Felines** is a web-based management system designed to digitize the interactions between the student body and the campus cat population. It applies a satirical, hyper-bureaucratic lens to simple animal observation.

## Features implemented (Frontend)
-   **Public Registry**: View and search the archive of feline deeds.
-   **Submit Evidence**: File report for commendations or infractions.
-   **Backend Readiness**: All API calls are abstracted in `src/services/api.js`.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v18 or higher)
-   npm (v9 or higher)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    -   Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```
    -   The `.env` file is already pre-configured to use the Mock API by default:
        ```env
        VITE_API_BASE_URL=http://localhost:3000/api
        VITE_USE_MOCK_API=true
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Mock API vs Real Backend
The project is currently configured to use a **Mock API** adapter.
-   To switch to a real backend, update your `.env` file:
    ```env
    VITE_USE_MOCK_API=false
    ```
-   The service layer in `src/services/api.js` handles this switch automatically.

## Project Structure
-   `src/components`: Reusable UI components.
-   `src/pages`: Page components (Registry, SubmitEvidence, etc.).
-   `src/services`: API service abstraction (`api.js`).
-   `src/data`: Mock data files for development.
