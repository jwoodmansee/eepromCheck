import React, {Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import TestedPassedResults from './TestedPassedResults';


//import FailedTable from './FailedTable';

var pM = {
    margin: '50px, 550px, 0px, 550px'
}


class DisplayFailures extends Component {
    constructor(props) {
        super(props)

        this.state = {
            marginalFails: [],
            testResults: []
            // passedView: false
        }

        this.onRowClick = this.onRowClick.bind(this)
        // this.viewPassedResults = this.viewPassedResults.bind(this)
    }

    componentDidMount() {
        let param = this.props.match.params.modelBom;
        axios({
            method: 'get',
            url: `http://localhost:6060/failures/${param}`,
            responseType: 'json'
        }).then(response => {
            this.setState({ marginalFails: response.data })
        }).catch(error => {
            console.log("The error is:", error)
        });
    }

   onRowClick(state, rowInfo, column, instance) {
        return {
            onClick: e => {
                let model = rowInfo.row.model
                let bom = rowInfo.row.bom
                let testName = rowInfo.row.testName
                let band = rowInfo.row.band
                let direction = rowInfo.row.direction
                let params = model + '/' + bom + '/' + testName + '/' + band + '/' + direction;
                axios({
                    method: 'get',
                    url: `http://localhost:6060/tested/${params}`,
                    responseType: 'json'
                }).then(response => {
                    this.setState({ testResults: response.data })
                }).catch(error => {
                    console.log('Error is Not good:', error)
                });
            }
        }
    }

    // viewPassedResults() {
    //     let testResults = this.state.testResults;
    //     console.log(testResults)
    //     if (this.state.passedView) {
    //         return (
    //             <div>
    //                 <div className='modal-body'>
    //                     <TestedPassedResults testResults={this.state.testResults} />
    //                 </div>
    //                 <div className="modal-footer">
    //                     <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
    //                     <button
    //                         onClick={() => { this.setState({ passedView: false }) }}
    //                         type="button"
    //                         className="btn btn-primary"
    //                     >
    //                     Back
    //                     </button>
    //                 </div>
    //             </div>
    //         )
    //     }
    // }

    render() {
        const { marginalFails } = this.state;
        return (
            <div className='container'>
                <h2 className='text-center'>Failed Amps</h2>
                <ReactTable 
                    data={marginalFails}
                    columns={[
                        {
                            Header: 'Model',
                            accessor: 'model',
                            maxWidth: 200 
                            
                        },
                        {
                            Header: 'Bom',
                            accessor: 'bom',
                            maxWidth: 200
                        },
                        {
                            Header: 'Amp Serial',
                            accessor: 'ampSerial',
                        },
                        {
                            Header: 'Band',
                            accessor: 'band',
                            
                        },
                        {
                            Header: 'Direction',
                            accessor: 'direction'
                        },
                        {
                            Header: 'Test Name',
                            accessor: 'testName'
                        },
                        {
                            Header: 'Test Result',
                            accessor: 'results'
                        },
                        {
                            Header: 'Lower Limit',
                            accessor: 'lowerLimit'
                        },
                        {
                            Header: 'Upper Limit',
                            accessor: 'upperLimit'
                        },
                        {
                            Header: 'Eeprom Result',
                            accessor: 'eepromResult'
                        },
                        {
                            Header: 'Eeprom Lower Limit',
                            accessor: 'lowerEeprom'
                        },
                        {
                            Header: 'Eeprom Upper Limit',
                            accessor: 'upperEeprom'
                        },
                        {
                            Header: 'TestStation',
                            accessor: 'tester'
                        },
                        {
                            Header: 'Jig',
                            accessor: 'jig'
                        }
                    ]}
                    getTrProps={this.onRowClick}
                    defaultPageSize={20}
                    className='-striped -highlight text-center'
                    style={{height: "400px"}}
                />
                <Link to='/' className='btn btn-primary'>Back</Link>
                <TestedPassedResults testResults={this.state.testResults} />
                
            </div>
        );

    }
}

export default DisplayFailures;