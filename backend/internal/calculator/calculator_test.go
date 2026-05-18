package calculator

import (
	"errors"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name string
		req  Request
		want float64
	}{
		{name: "adds", req: Request{Operation: Add, A: 5, B: ptr(3)}, want: 8},
		{name: "subtracts", req: Request{Operation: Subtract, A: 5, B: ptr(3)}, want: 2},
		{name: "multiplies", req: Request{Operation: Multiply, A: 5, B: ptr(3)}, want: 15},
		{name: "divides", req: Request{Operation: Divide, A: 12, B: ptr(3)}, want: 4},
		{name: "powers", req: Request{Operation: Power, A: 2, B: ptr(4)}, want: 16},
		{name: "square root", req: Request{Operation: Sqrt, A: 81}, want: 9},
		{name: "percent", req: Request{Operation: Percent, A: 200, B: ptr(15)}, want: 30},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(tt.req)
			if err != nil {
				t.Fatalf("Calculate() error = %v", err)
			}
			if got != tt.want {
				t.Fatalf("Calculate() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCalculateErrors(t *testing.T) {
	tests := []struct {
		name string
		req  Request
		want error
	}{
		{name: "division by zero", req: Request{Operation: Divide, A: 9, B: ptr(0)}, want: ErrDivisionByZero},
		{name: "negative square root", req: Request{Operation: Sqrt, A: -1}, want: ErrNegativeRoot},
		{name: "unknown operation", req: Request{Operation: "modulo", A: 9, B: ptr(4)}, want: ErrUnknownOp},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := Calculate(tt.req)
			if !errors.Is(err, tt.want) {
				t.Fatalf("Calculate() error = %v, want %v", err, tt.want)
			}
		})
	}
}

func ptr(value float64) *float64 {
	return &value
}
