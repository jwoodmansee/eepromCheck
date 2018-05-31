import React, {Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import FailedTable from './FailedTable';

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
            <div>
                <FailedTable marginalFails={this.state.marginalFails} />
                <Link to='/' className='btn btn-primary'>Back</Link>
            </div>
        );

    }
}

export default DisplayFailures;