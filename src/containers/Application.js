import React from 'react';
import Navbar from '../Components/Navbar'
import Home from '../Components/Home';

class Application extends React.Component {
   
    
    render() {
        return (
            <div>
                <Navbar />
                <Home />
            </div>
        )
    }
   
}

export default Application;