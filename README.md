# Calculator

A full-stack calculator application with a React + TypeScript frontend and a Go REST API backend. The frontend consumes the backend API for basic and advanced arithmetic operations with validation, error handling, responsive layout, and test coverage across layers.


## Project Structure

```text
backend/
  cmd/api/                 Go API entrypoint
  internal/calculator/     Pure calculator domain logic
  internal/httpapi/        REST handlers and validation
frontend/
  src/App.tsx                                      App composition root
  src/features/calculator/application/            Calculator state and use-case orchestration
  src/features/calculator/components/             Presentational React components
  src/features/calculator/domain/                 Pure calculator UI/domain helpers
  src/features/calculator/infrastructure/         REST API client
```

## Prerequisites

- Go 1.22+
- Node.js 22+ and npm
- Optional: Docker and Docker Compose

## Run Locally

Start the backend:

```bash
cd backend
go run ./cmd/api
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend calls the API at `http://localhost:8080` by default.

To point the frontend at a different backend URL:

```bash
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

## API Usage

Health check:

```bash
curl http://localhost:8080/health
```

Calculate:

```bash
curl -X POST http://localhost:8080/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":10,"b":5}'
```

Response:

```json
{
  "operation": "add",
  "result": 15
}
```

Supported operations:

| Operation | Body example | Meaning |
| --- | --- | --- |
| `add` | `{"operation":"add","a":10,"b":5}` | `10 + 5` |
| `subtract` | `{"operation":"subtract","a":10,"b":5}` | `10 - 5` |
| `multiply` | `{"operation":"multiply","a":10,"b":5}` | `10 * 5` |
| `divide` | `{"operation":"divide","a":10,"b":5}` | `10 / 5` |
| `power` | `{"operation":"power","a":2,"b":3}` | `2 ^ 3` |
| `sqrt` | `{"operation":"sqrt","a":81}` | square root of `81` |
| `percent` | `{"operation":"percent","a":200,"b":15}` | `15%` of `200` |

Error example:

```bash
curl -X POST http://localhost:8080/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","a":10,"b":0}'
```

```json
{
  "error": "division by zero"
}
```

## Tests and Coverage

Backend:

```bash
cd backend
go test ./... -cover
go test ./... -coverprofile=coverage.out
go tool cover -func=coverage.out
go tool cover -html=coverage.out -o coverage.html
open coverage.html
```

Current backend coverage:

- Total statements: `95.8%`
- `internal/calculator`: `100.0%`
- `internal/httpapi`: `97.6%`

If Go is not installed locally, run coverage with Docker from the repository root:

```bash
docker run --rm -v "$PWD":/app -w /app/backend golang:1.22 \
  sh -c 'go test ./... -coverprofile=coverage.out && go tool cover -func=coverage.out && go tool cover -html=coverage.out -o coverage.html'
```

Frontend:

```bash
cd frontend
npm install
npm test
open coverage/index.html
```

Vitest writes an HTML coverage report to `frontend/coverage/` and enforces a minimum `90%` threshold for statements, branches, functions, and lines.

Current frontend coverage:

- Statements: `100%`
- Branches: `93.22%`
- Functions: `100%`
- Lines: `100%`

## Docker

Run the full stack:

```bash
docker compose up --build
```

Open `http://localhost:5173`. The API is available at `http://localhost:8080`.

## Design Decisions

- Calculator math lives in `backend/internal/calculator` as pure functions so it is easy to unit test without HTTP setup.
- The HTTP layer handles JSON parsing, operand validation, edge cases, and consistent JSON responses.
- The API uses a single `POST /calculate` endpoint with an `operation` field to keep the REST surface compact and easy to extend.

<img width="1800" height="1017" alt="image" src="https://github.com/user-attachments/assets/cc455d81-0f5b-443d-906a-72f46acd886d" />
<img width="432" height="955" alt="image" src="https://github.com/user-attachments/assets/a278f61e-5cef-4daa-8056-7f6a2b2a3ca8" />


<img width="901" height="451" alt="image" src="https://github.com/user-attachments/assets/1ca8bd1d-691b-4e5e-b99b-cfe3b148b914" />
<img width="801" height="493" alt="image" src="https://github.com/user-attachments/assets/4fd160fb-d460-40ac-b33b-04dc8c607c00" />
<img width="1200" height="245" alt="image" src="https://github.com/user-attachments/assets/e09939dc-ffcc-48f3-81fd-874c1ce640a5" />

- The frontend uses a feature-first Clean Architecture style:
  - `domain` contains pure operation metadata, expression building, parsing, and formatting helpers.
  - `application` contains the `useCalculator` hook that orchestrates state, validation, and the calculation use case.
  - `infrastructure` contains the REST API adapter.
  - `components` contains presentational UI pieces.
- The UI is split into small components to keep responsibilities focused and make tests easier to reason about.
- State remains local to the calculator feature because the app is intentionally small and does not need a global state library.

## AI Prompts Used

- "check coverage, need to reach 90% minimum"
- "store components into the proper folder"
