package httpapi

import (
	"encoding/json"
	"errors"
	"math"
	"net/http"

	"github.com/rejit/sezzle-calculator/backend/internal/calculator"
)

type Server struct {
	mux *http.ServeMux
}

type calculateRequest struct {
	Operation calculator.Operation `json:"operation"`
	A         *float64             `json:"a"`
	B         *float64             `json:"b,omitempty"`
}

type calculateResponse struct {
	Operation calculator.Operation `json:"operation"`
	Result    float64              `json:"result"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func NewServer() *Server {
	mux := http.NewServeMux()
	server := &Server{mux: mux}
	mux.HandleFunc("GET /health", server.health)
	mux.HandleFunc("POST /calculate", server.calculate)
	return server
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	s.mux.ServeHTTP(w, r)
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) calculate(w http.ResponseWriter, r *http.Request) {
	var input calculateRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "request body must be valid JSON")
		return
	}

	if input.A == nil || math.IsNaN(*input.A) || math.IsInf(*input.A, 0) {
		writeError(w, http.StatusBadRequest, "a must be a finite number")
		return
	}

	if !calculator.IsSupportedOperation(input.Operation) {
		writeError(w, http.StatusBadRequest, "operation must be one of add, subtract, multiply, divide, power, sqrt, percent")
		return
	}

	if calculator.RequiresSecondOperand(input.Operation) {
		if input.B == nil || math.IsNaN(*input.B) || math.IsInf(*input.B, 0) {
			writeError(w, http.StatusBadRequest, "b must be a finite number for this operation")
			return
		}
	}

	result, err := calculator.Calculate(calculator.Request{
		Operation: input.Operation,
		A:         *input.A,
		B:         input.B,
	})
	if err != nil {
		status := http.StatusBadRequest
		message := err.Error()
		if errors.Is(err, calculator.ErrUnknownOp) {
			message = "operation must be one of add, subtract, multiply, divide, power, sqrt, percent"
		}
		writeError(w, status, message)
		return
	}

	writeJSON(w, http.StatusOK, calculateResponse{
		Operation: input.Operation,
		Result:    result,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorResponse{Error: message})
}
