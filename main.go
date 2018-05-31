package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

//Failure set the key values for the array fetched in the store class
type Failure struct {
	Model string `json:"model"`
	Bom   string `json:"bom"`
}

//MarginalFailed set data for amps that failed due to eeproms.
type MarginalFailed struct {
	AmpModelID   int     `json:"ampModelId"`
	Model        string  `json:"model"`
	AmpSerial    int     `json:"ampSerial"`
	BomID        string  `json:"bomId"`
	Bom          string  `json:"bom"`
	Band         int     `json:"band"`
	Direction    string  `json:"direction"`
	TestName     string  `json:"testName"`
	Results      float32 `json:"results"`
	LowerLimit   float32 `json:"lowerLimit"`
	UpperLimit   float32 `json:"upperLimit"`
	EepromResult int     `json:"eepromResult"`
	LowerEeprom  int     `json:"lowerEeprom"`
	UpperEeprom  int     `json:"upperEeprom"`
	Jig          string  `json:"jig"`
	Tester       string  `json:"tester"`
}

var failures []Failure

// getFailuresHandler function will get all marginal failures.
func getFailures(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Method:", r.Method)
	switch r.Method {
	case "OPTIONS":
		// handle preflight
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

	case "GET":
		// respond to actual request
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
	}

	failures, err := store.GetFailures()

	failureListBytes, err := json.Marshal(failures)

	if err != nil {
		fmt.Println(fmt.Errorf("Error: %v", err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(failureListBytes)
}

//QueryParams ...
type QueryParams struct {
	Model string
	Bom   string
}

var fails []MarginalFailed

// FailedResults get all the amp failed results of amps that failed marginally
func FailedResults(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Method: ", r.Method)
	switch r.Method {
	case "OPTIONS":
		// handle preflight
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

	case "GET":
		// respond to actual request
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
	}

	fmt.Println(r.URL.Path)
	serial := strings.Split(r.URL.Path, "/")

	if len(serial[2]) > 0 {
		ampBom := serial[2]
		fmt.Println(ampBom)

		qp := QueryParams{
			Model: ampBom[0 : len(ampBom)-1],
			Bom:   ampBom[len(ampBom)-1:],
		}
		store.SetStoreQueryParams(qp)
	}

	fails, err := store.getFailedResults()
	if err != nil {
		fmt.Println("Error:", err)
	}

	failedList, err := json.Marshal(fails)
	if err != nil {
		fmt.Println("Error:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(failedList)
}

func newRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/failures", getFailures).Methods("GET")
	r.HandleFunc("/failures/{modelBom}", FailedResults).Methods("GET")

	return r
}

func main() {
	fmt.Println("Starting server...")

	connString := "server stuff"
	db, err := sql.Open("mssql", connString)

	if err != nil {
		panic(err)
	}
	err = db.Ping()

	if err != nil {
		panic(err)
	}

	InitStore(&dbStore{db: db})

	r := newRouter()
	fmt.Println("Serving on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD"}), handlers.AllowedOrigins([]string{"*"}))(r)))
}
