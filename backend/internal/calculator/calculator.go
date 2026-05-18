package calculator

import (
	"errors"
	"math"
)

var (
	ErrDivisionByZero = errors.New("division by zero")
	ErrNegativeRoot   = errors.New("square root of negative number")
	ErrUnknownOp      = errors.New("unknown operation")
)

type Operation string

const (
	Add      Operation = "add"
	Subtract Operation = "subtract"
	Multiply Operation = "multiply"
	Divide   Operation = "divide"
	Power    Operation = "power"
	Sqrt     Operation = "sqrt"
	Percent  Operation = "percent"
)

type Request struct {
	Operation Operation `json:"operation"`
	A         float64   `json:"a"`
	B         *float64  `json:"b,omitempty"`
}

func Calculate(req Request) (float64, error) {
	switch req.Operation {
	case Add:
		return req.A + valueOrZero(req.B), nil
	case Subtract:
		return req.A - valueOrZero(req.B), nil
	case Multiply:
		return req.A * valueOrZero(req.B), nil
	case Divide:
		b := valueOrZero(req.B)
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		return req.A / b, nil
	case Power:
		return math.Pow(req.A, valueOrZero(req.B)), nil
	case Sqrt:
		if req.A < 0 {
			return 0, ErrNegativeRoot
		}
		return math.Sqrt(req.A), nil
	case Percent:
		return req.A * valueOrZero(req.B) / 100, nil
	default:
		return 0, ErrUnknownOp
	}
}

func RequiresSecondOperand(op Operation) bool {
	return op != Sqrt
}

func IsSupportedOperation(op Operation) bool {
	switch op {
	case Add, Subtract, Multiply, Divide, Power, Sqrt, Percent:
		return true
	default:
		return false
	}
}

func valueOrZero(value *float64) float64 {
	if value == nil {
		return 0
	}
	return *value
}
