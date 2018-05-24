import React, {Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

class DisplayFailures extends Component {
    constructor(props) {
        super(props)

        this.state = {marginalFails: [] }
    }

    componentWillMount() {
        let param = this.props.match.params.modelBom;
        console.log(param)
        axios({
            method: 'get',
            url: `http://localhost:8080/failures/${param}`,
            responseType: 'json'
        }).then(response => {
            this.setState({ marginalFails: response.data })
            console.log(this.state.marginalFails)
        }).catch(error => {
            console.log("The error is:", error)
        });
    }

    render() {
        return (
            <div className='container'>
            <Navbar />
                <table className='table table-hover table-bordered container col-lg'>
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
                            <th scope='col'>Date</th>
                        </tr>
                    </thead>
                </table>
                <Link to='/' className='btn btn-primary'>Back</Link>
            </div>
        );

    }
}

export default DisplayFailures;