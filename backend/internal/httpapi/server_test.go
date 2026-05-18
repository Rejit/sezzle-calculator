package httpapi

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

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
		{name: "unknown operation", body: `{"operation":"modulo","a":1}`, want: http.StatusBadRequest},
		{name: "missing second operand", body: `{"operation":"add","a":1}`, want: http.StatusBadRequest},
		{name: "division by zero", body: `{"operation":"divide","a":1,"b":0}`, want: http.StatusBadRequest},
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
