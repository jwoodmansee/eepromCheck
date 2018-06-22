import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

var buttonMargins = {
    marginLeft: "500px",
    marginRight: "750px",
    padding: "25px 50px 25px 125px"

}

var textColor = {
    color: "black",
    textAlign: "center",
    marginLeft: "400px",
    marginRight: "750px",
    paddingTop: "25px"
}

var failHeader = {
    marginRight: "500px",
    marginLeft: "500px",
    textDecoration: "underline"
}

class Buttons extends React.Component {
    constructor(props) {
        super(props);

        this.state = { marginalFails: [] }

        this.generateButtons = this.generateButtons.bind(this)
    }

    generateButtons() {
        let button = this.props.failures.map(fail => {
            let date = Date.now();
            let model = fail.model;
            let bom = fail.bom;
            let modelBom = model + bom;
            if (model == null) return <h3>There no amps that currently meet the failed criteria!</h3>
            return (
                <div className='container' key={date}>
                    <li className='list-unstyled container'>
                        <Link to={`/failures/${modelBom}`} data-target={modelBom}>
                            <h4 style={textColor} className='text-center' data-target={modelBom}>{model}{bom}</h4>
                        </Link>
                    </li>
                </div>
            )
            console.log(button)
        });
        return button;
        
    }

    render() {
        return (
            <div>
                <h3 className='text-center text-capitalize'>Amps with Marginal Failures</h3>
                <ul>
                    {this.generateButtons()}
                </ul>
            </div>
        );
    }

}

export default Buttons;