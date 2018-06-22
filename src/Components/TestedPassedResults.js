import React, {Component} from 'react';
import ReactTable from 'react-table';

class TestedPassedResults extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { testResults } = this.props
        return(
            <div className='container'>
            <h2 className='text-center'>Last 20 Amps that have passed</h2>
            <ReactTable 
                data={testResults}
                columns={[
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
                ]}
                defaultPageSize={20}
                className='-striped -highlight text-center'
                style={{height: "400px"}}
            />
            </div>
        )
    }
}

export default TestedPassedResults;