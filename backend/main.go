package main

import (
	"fmt"
	"log"
	"net/http"
	"spotify/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := mux.NewRouter()
	r.HandleFunc("/login", handlers.HandleLogin)
	r.HandleFunc("/callback", handlers.HandleCallback)
	r.HandleFunc("/top", handlers.GetTopItems)

	fmt.Println("Server started on port :8000")

	http.ListenAndServe("127.0.0.1:8000", r)

}
