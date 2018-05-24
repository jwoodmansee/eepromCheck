import React, {Component} from 'react';
import { Link } from 'react-router-dom';

var backBtn = {
    marginLeft: '900px',
    marginRight: '500px'
}

const NoMatch = () => {
    return(
        <div>
            <h3 className='container text-center text-capitalize' >Not What you are looking for!?!</h3>
            <Link to='/' style={backBtn} className='btn btn-primary'>Back</Link>
        </div>
    )
}

export default NoMatch;