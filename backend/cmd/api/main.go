package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rejit/sezzle-calculator/backend/internal/httpapi"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := httpapi.NewServer()
	log.Printf("calculator API listening on :%s", port)
	if err := http.ListenAndServe(":"+port, server); err != nil {
		log.Fatal(err)
	}
}
