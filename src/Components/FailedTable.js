import React, {Component} from 'react';
import {Link} from 'react-router-dom';

var tStyle = {
    marginRight: "800px",
    marginLeft: "-400px",
    marginTop: "75px"
}

class FailedTable extends Component {
    constructor(props){
        super(props)

    }


    displayFailedData() {
        let failedData = this.props.marginalFails.map( failed => {
            let date = Date.now();
            let model = failed.model;
            let bom = failed.bom;
            let serial = failed.ampSerial;
            let band = failed.band;
            let direction = failed.direction;
            let testName = failed.testName;
            let testResult = failed.results;
            let lowLimit = failed.lowerLimit;
            let upLimit = failed.upperLimit;
            let eeLower = failed.lowerEeprom;
            let eeUpper = failed.upperEeprom;
            let eeResult = failed.eepromResult;
            let tester = failed.tester;
            let jig = failed.jig;
            return (
                <tbody>
                    <tr key={date}>
                        <td>{failed.model}{bom}{serial}</td>
                        <td>{band} {direction} {testName}</td>
                        <td>{testResult}</td>
                        <td>{lowLimit}</td>
                        <td>{upLimit}</td>
                        <td>{eeResult}</td>
                        <td>{eeLower}</td>
                        <td>{eeUpper}</td>
                        <td>{tester}</td>
                        <td>{jig}</td>
                    </tr>
                </tbody>
            )
        });
        return failedData;
    }

    render() {
        return(
            <div className='container'>
                 <table className='table table-hover table-bordered table-dark container col-lg' style={tStyle}>
                    <thead>
                        <tr>
                            <th scope='col'>AmpInfo</th>
                            <th scope='col'>Test Performed</th>
                            <th scope='col'>Test Result</th>
                            <th scope='col'>Test LowerLimit</th>
                            <th scope='col'>Test UpperLimit</th>
                            <th scope='col'>Eeprom Result</th>
                            <th scope='col'>Eeprom LowerLimt</th>
                            <th scope='col'>Eeprom UpperLimit</th>
                            <th scope='col'>Tester</th>
                            <th scope='col'>Jig</th>
                        </tr>
                    </thead>
                    {this.displayFailedData()}
                </table>
            </div>
        )

    }
}

export default FailedTable;
