package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"github.com/rejit/sezzle-calculator/backend/internal/httpapi"
)

func main() {
	if err := run(os.Getenv, http.ListenAndServe); err != nil {
		log.Fatal(err)
	}
}

func run(getenv func(string) string, listenAndServe func(string, http.Handler) error) error {
	port := getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := httpapi.NewServer()
	log.Printf("calculator API listening on :%s", port)
	return listenAndServe(net.JoinHostPort("", port), server)
}
