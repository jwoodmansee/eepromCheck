import React, {Component} from 'react';
import axios from 'axios';

import Buttons from './Buttons'

class GetEepromFailures extends Component {
    constructor() {
        super()

        this.state = { failures: []}
    }

    componentWillMount() {
        axios({
            method: 'get',
            url: 'http://localhost:8080/failures',
            responseType: 'json'
        }).then(response => {
            this.setState({ failures: response.data })
            console.log(this.state.failures)
        }).catch(response => {
            console.log("The issue is ", response.error)
        });
    }

    render() {
        return (
            <div>
                <Buttons failures={this.state.failures} />
            </div>
        )
    }
}

export default GetEepromFailures;