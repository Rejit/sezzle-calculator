package main

import (
	"errors"
	"net/http"
	"testing"
)

func TestRunUsesDefaultPort(t *testing.T) {
	var gotAddr string
	err := run(
		func(string) string { return "" },
		func(addr string, handler http.Handler) error {
			gotAddr = addr
			if handler == nil {
				t.Fatal("handler is nil")
			}
			return nil
		},
	)

	if err != nil {
		t.Fatalf("run() error = %v", err)
	}
	if gotAddr != ":8080" {
		t.Fatalf("addr = %q, want %q", gotAddr, ":8080")
	}
}

func TestRunUsesConfiguredPort(t *testing.T) {
	var gotAddr string
	err := run(
		func(key string) string {
			if key != "PORT" {
				t.Fatalf("key = %q, want PORT", key)
			}
			return "9090"
		},
		func(addr string, _ http.Handler) error {
			gotAddr = addr
			return nil
		},
	)

	if err != nil {
		t.Fatalf("run() error = %v", err)
	}
	if gotAddr != ":9090" {
		t.Fatalf("addr = %q, want %q", gotAddr, ":9090")
	}
}

func TestRunReturnsServerErrors(t *testing.T) {
	want := errors.New("listen failed")

	err := run(
		func(string) string { return "8080" },
		func(string, http.Handler) error { return want },
	)

	if !errors.Is(err, want) {
		t.Fatalf("run() error = %v, want %v", err, want)
	}
}
