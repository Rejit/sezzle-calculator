# Calculator

## Objective
Build a full-stack calculator application with a React frontend and a backend microservice. The frontend should consume the backend API to perform basic and advanced arithmetic operations. Focus on clean design, maintainable code, and testable architecture.

## Requirements Functional

### Operations:
- Addition, Subtraction, Multiplication, Division
- Optional: Exponentiation, Square Root, Percentage

### Frontend (React):
- Intuitive UI for entering input and displaying results
- Input validation and error handling
- Responsive design (basic mobile support)

### Backend (REST API):
- Expose endpoints for calculator operations
- Validate input and handle edge cases (division by zero, invalid data)
- Return results in JSON format

### Non-Functional
- Clean, readable, and idiomatic code (frontend and backend)
- Unit tests covering key functionality for both layers
- Documentation: setup instructions, API usage, and design rationale
- Optional: Dockerfile for full-stack deployment

### Constraints
- Frontend: React (TypeScript preferred)
- Backend: Go is perferred

### Deliverables
1. Git repository with frontend and backend code
2. README with setup instructions, API examples, and design decisions
3. Unit tests and coverage report
4. Optional: Dockerfile to run frontend + backend together

### Instructions
1. Use any AI tooling you would like
2. Spend ~2–4 hours on this assignment. Prioritize correctness, clarity, and maintainability over extra features.
3. Push your solution to GitHub, GitLab, or another Git repository.
4. Share the repository link with us for evaluation.
5. Share any prompts that you used in your work
6. Make sure your README includes:
    - Setup instructions
    - How to run the frontend and backend
    - Examples of API calls (if using REST)
    - Design decisions or assumptions


## Project Structure

```text
backend/
  cmd/api/                 Go API entrypoint
  internal/calculator/     Pure calculator domain logic
  internal/httpapi/        REST handlers and validation
frontend/
  src/App.tsx              Calculator UI
  src/services/            API client
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
go tool cover -html=coverage.out
```

Frontend:

```bash
cd frontend
npm install
npm test
```

Vitest writes an HTML coverage report to `frontend/coverage/`.

## Docker

Run the full stack:

```bash
docker compose up --build
```

Open `http://localhost:5173`. The API is available at `http://localhost:8080`.

## Design Decisions

- Calculator math lives in `backend/internal/calculator` as pure functions so it is easy to unit test without HTTP setup.
- The HTTP layer handles JSON parsing, operand validation, edge cases, and consistent JSON responses.
- React state is kept local because the app is small and does not need a global state library.
- The frontend service module isolates API calls from the UI, making the UI easier to test and replace later.
- The API uses a single `POST /calculate` endpoint with an `operation` field to keep the REST surface compact and easy to extend.

<img width="1800" height="1017" alt="image" src="https://github.com/user-attachments/assets/cc455d81-0f5b-443d-906a-72f46acd886d" />
<img width="432" height="955" alt="image" src="https://github.com/user-attachments/assets/a278f61e-5cef-4daa-8056-7f6a2b2a3ca8" />


<img width="901" height="451" alt="image" src="https://github.com/user-attachments/assets/1ca8bd1d-691b-4e5e-b99b-cfe3b148b914" />
<img width="801" height="493" alt="image" src="https://github.com/user-attachments/assets/4fd160fb-d460-40ac-b33b-04dc8c607c00" />
<img width="1200" height="245" alt="image" src="https://github.com/user-attachments/assets/e09939dc-ffcc-48f3-81fd-874c1ce640a5" />

