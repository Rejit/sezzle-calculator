FROM golang:1.22-alpine AS build

WORKDIR /app
COPY go.mod ./
COPY . ./
RUN go test ./... && go build -o /calculator-api ./cmd/api

FROM alpine:3.20

WORKDIR /app
COPY --from=build /calculator-api /usr/local/bin/calculator-api
EXPOSE 8080
CMD ["calculator-api"]
