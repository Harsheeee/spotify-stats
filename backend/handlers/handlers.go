package handlers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
	"spotify/models"
)

var state string = "spotify_state"
var scope string = "user-top-read"



func HandleLogin(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
	baseUrl := "https://accounts.spotify.com/authorize"
	client_id := os.Getenv("SPOTIFY_ID")
	redirect_uri := os.Getenv("REDIRECT_URI")

	qurl, _ := url.Parse(baseUrl)

	query := url.Values{}
	query.Set("response_type", "code")
	query.Set("client_id", client_id)
	query.Set("scope", scope)
	query.Set("redirect_uri", redirect_uri)
	query.Set("state", state)
	qurl.RawQuery = query.Encode()

	http.Redirect(w, r, qurl.String(), http.StatusTemporaryRedirect)
}

func HandleCallback(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	err := params.Get("error")
	if err != "" {
		http.Error(w, err, http.StatusForbidden)
		return
	}
	callbackState := params.Get("state")

	if callbackState != state {
		http.Error(w, "Invalid State", http.StatusInternalServerError)
		return
	}

	code := params.Get("code")
	resp := exchangeCode(code)
	frontendUrl := "http://localhost:5173/dashboard"
	redirectUrl := fmt.Sprintf("%s?access_token=%s", frontendUrl, resp.AccessToken)
	http.Redirect(w, r, redirectUrl, http.StatusFound)
}

func GetTopItems(w http.ResponseWriter, r *http.Request) {

}

func exchangeCode(code string) models.TokenResponse{
	godotenv.Load()
	client_id := os.Getenv("SPOTIFY_ID")
	redirect_uri := os.Getenv("REDIRECT_URI")
	authString := fmt.Sprintf("%s:%s", client_id, os.Getenv("SPOTIFY_SECRET"))
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(authString))
	tokenUrl := "https://accounts.spotify.com/api/token"

	formData := url.Values{}

	formData.Set("grant_type", "authorization_code")
	formData.Set("code", code)
	formData.Set("redirect_uri", redirect_uri)

	req, err := http.NewRequest("POST", tokenUrl, bytes.NewBufferString(formData.Encode()))

	if err != nil {
		log.Fatal("Error creating request ", err)
	}

	req.Header.Set("Authorization", "Basic "+encodedAuth)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	var tokenresp models.TokenResponse

	if resp.StatusCode==200{
		
		decoder := json.NewDecoder(resp.Body)
		decoder.Decode(&tokenresp)
	}
	return tokenresp
}
