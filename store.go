package main

import (
	"database/sql"
	"fmt"
)

//Store ...
type Store interface {
	GetFailures() ([]*Failure, error)
	getFailedResults() ([]*MarginalFailed, error)
	SetStoreQueryParams(incoming QueryParams)
	SetTestedQueryParams(tp TestedParams)
	getTestedResults() ([]*TestedResults, error)
}

type dbStore struct {
	db *sql.DB
}

func (store *dbStore) GetFailures() ([]*Failure, error) {
	rows, err := store.db.Query(`
		SELECT DISTINCT 
			am.[model], 
			bm.[name]
		FROM[Manufacturing].[dbo].[TestResultChild] AS trc
		JOIN TestResultParent AS trp on trp.testresultparent_id = trc.testresultparent_id
		JOIN TestSpec AS ts on ts.testspec_id = trc.testspec_id
		JOIN Bom AS bm ON trp.bom_id = bm.bom_id
		JOIN AmpModel as am on am.ampmodel_id = bm.ampmodel_id
		JOIN TestStation as test on trp.teststation_id = test.teststation_id
		WHERE Cast(datetime as date) = CAST(GETDATE() as date)
		AND (eeprom = eeprom_lowerlimit OR eeprom = eeprom_upperlimit)
		AND ((result < lowerlimit AND lowerlimit - result < 2) OR(result > upperlimit AND result - upperlimit < 2))
		ORDER By am.[model] DESC;`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	failures := []*Failure{}
	for rows.Next() {
		failure := &Failure{}

		if err := rows.Scan(&failure.Model, &failure.Bom); err != nil {
			return nil, err
		}

		failures = append(failures, failure)
	}
	return failures, nil
}

var gQP QueryParams

func (store *dbStore) SetStoreQueryParams(incoming QueryParams) {
	gQP = QueryParams{
		Model: incoming.Model,
		Bom:   incoming.Bom,
	}
	fmt.Println(gQP)
}

func (store *dbStore) getFailedResults() ([]*MarginalFailed, error) {
	rows, err := store.db.Query(`
		SELECT am.[ampmodel_id],
			am.[model], 
			trp.[ampserial_id],
			bm.[bom_id],  
			bm.[name], 
			bi.[bandnumber],
	 		d.[name], 
	 		trc.[name], 
	 		trc.[result], 
	 		ts.[lowerlimit], 
	 		ts.[upperlimit], 
	 		trc.[eeprom], 
	 		ts.[eeprom_lowerlimit], 
	 		ts.[eeprom_upperlimit], 
	 		j.[barcode], 
	 		test.[name]
		FROM[Manufacturing].[dbo].[TestResultChild] AS trc
		JOIN TestResultParent AS trp on trp.testresultparent_id = trc.testresultparent_id
		JOIN Band AS b on b.band_id = trc.band_id
		JOIN BandInfo AS bi on bi.bandinfo_id = b.bandinfo_id
		JOIN Direction AS d on b.direction_id = d.direction_id
		JOIN TestSpec AS ts on ts.testspec_id = trc.testspec_id
		JOIN Jig AS j on trp.jig_id = j.jig_id
		JOIN Bom AS bm ON trp.bom_id = bm.bom_id
		JOIN AmpModel as am on am.ampmodel_id = bm.ampmodel_id
		JOIN TestStation as test on trp.teststation_id = test.teststation_id
		WHERE am.[model] =?1 AND bm.[name] =?2
		AND Cast(datetime as date) = CAST(GETDATE() as date)
		AND(eeprom = eeprom_lowerlimit OR eeprom = eeprom_upperlimit)
		AND((result < lowerlimit AND lowerlimit - result < 2) OR(result > upperlimit AND result - upperlimit < 2))
		ORDER By am.[model] DESC;`, gQP.Model, gQP.Bom)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	fails := []*MarginalFailed{}
	for rows.Next() {
		fail := &MarginalFailed{}

		if err := rows.Scan(
			&fail.AmpModelID,
			&fail.Model,
			&fail.AmpSerial,
			&fail.BomID,
			&fail.Bom,
			&fail.Band,
			&fail.Direction,
			&fail.TestName,
			&fail.Results,
			&fail.LowerLimit,
			&fail.UpperLimit,
			&fail.EepromResult,
			&fail.LowerEeprom,
			&fail.UpperEeprom,
			&fail.Jig,
			&fail.Tester); err != nil {
			return nil, err
		}

		fails = append(fails, fail)
	}
	return fails, nil
}

var gTP TestedParams

func (store *dbStore) SetTestedQueryParams(tp TestedParams) {
	gTP = TestedParams{
		Model:     tp.Model,
		Bom:       tp.Bom,
		Band:      tp.Band,
		Direction: tp.Direction,
		TestName:  tp.TestName,
	}
	fmt.Println(gTP)
}

func (store *dbStore) getTestedResults() ([]*TestedResults, error) {
	rows, err := store.db.Query(`
		SELECT TOP 20
	   		 am.[model]
	  		,bm.[name]
      		,trc.[passed]
      		,bi.[bandnumber]
	  		,d.[name]
      		,trc.[name]
      		,trc.[result]
	  		,ts.[lowerlimit]
	  		,ts.[upperlimit]
      		,trc.[eeprom]
	  		,ts.[eeprom_lowerlimit]
	  		,ts.[eeprom_upperlimit]
  		FROM [Manufacturing].[dbo].[TestResultChild] AS trc
  		JOIN TestResultParent AS trp on trp.testresultparent_id = trc.testresultparent_id
  		JOIN Band AS b on b.band_id = trc.band_id
  		JOIN BandInfo AS bi on bi.bandinfo_id = b.bandinfo_id
  		JOIN Direction AS d on b.direction_id = d.direction_id
  		JOIN TestSpec AS ts on ts.testspec_id = trc.testspec_id
  		JOIN Bom AS bm ON trp.bom_id = bm.bom_id
		JOIN AmpModel as am on am.ampmodel_id = bm.ampmodel_id
		WHERE am.[model] =?1 AND bm.[name] =?2 AND bi.[bandnumber] =?3 AND d.[name] =?4 AND trc.[name] =?5
		AND trc.passed = 1 
		ORDER By trc.testresultchild_id DESC;`, gTP.Model, gTP.Bom, gTP.Band, gTP.Direction, gTP.TestName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tested := []*TestedResults{}
	for rows.Next() {
		test := &TestedResults{}
		if err := rows.Scan(
			&test.Model,
			&test.Bom,
			&test.Passed,
			&test.Band,
			&test.Direction,
			&test.TestName,
			&test.Results,
			&test.LowerLimit,
			&test.UpperLimit,
			&test.EepromResult,
			&test.LowerEeprom,
			&test.UpperEeprom); err != nil {
			return nil, err
		}
		tested = append(tested, test)
	}
	return tested, nil
}

var store Store

// InitStore ...
func InitStore(s Store) {
	store = s
}
