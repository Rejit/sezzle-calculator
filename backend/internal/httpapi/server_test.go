package httpapi

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthEndpoint(t *testing.T) {
	server := NewServer()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()

	server.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body: %s", rec.Code, http.StatusOK, rec.Body.String())
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"status":"ok"}` {
		t.Fatalf("body = %s", got)
	}
}

func TestOptionsRequestIncludesCorsHeaders(t *testing.T) {
	server := NewServer()
	req := httptest.NewRequest(http.MethodOptions, "/calculate", nil)
	rec := httptest.NewRecorder()

	server.ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}
	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "*" {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, "*")
	}
	if got := rec.Header().Get("Access-Control-Allow-Methods"); got != "GET, POST, OPTIONS" {
		t.Fatalf("Access-Control-Allow-Methods = %q", got)
	}
}

func TestCalculateEndpoint(t *testing.T) {
	server := NewServer()
	req := httptest.NewRequest(http.MethodPost, "/calculate", strings.NewReader(`{"operation":"multiply","a":7,"b":6}`))
	rec := httptest.NewRecorder()

	server.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body: %s", rec.Code, http.StatusOK, rec.Body.String())
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"operation":"multiply","result":42}` {
		t.Fatalf("body = %s", got)
	}
}

func TestCalculateEndpointValidation(t *testing.T) {
	tests := []struct {
		name string
		body string
		want int
	}{
		{name: "invalid json", body: `{`, want: http.StatusBadRequest},
		{name: "unknown field", body: `{"operation":"add","a":1,"b":2,"extra":3}`, want: http.StatusBadRequest},
		{name: "missing first operand", body: `{"operation":"add","b":1}`, want: http.StatusBadRequest},
		{name: "unknown operation", body: `{"operation":"modulo","a":1}`, want: http.StatusBadRequest},
		{name: "missing second operand", body: `{"operation":"add","a":1}`, want: http.StatusBadRequest},
		{name: "division by zero", body: `{"operation":"divide","a":1,"b":0}`, want: http.StatusBadRequest},
		{name: "negative square root", body: `{"operation":"sqrt","a":-1}`, want: http.StatusBadRequest},
		{name: "sqrt accepts one operand", body: `{"operation":"sqrt","a":16}`, want: http.StatusOK},
	}

	server := NewServer()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/calculate", strings.NewReader(tt.body))
			rec := httptest.NewRecorder()

			server.ServeHTTP(rec, req)

			if rec.Code != tt.want {
				t.Fatalf("status = %d, want %d; body: %s", rec.Code, tt.want, rec.Body.String())
			}
		})
	}
}
