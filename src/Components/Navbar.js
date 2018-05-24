import React, { Component } from 'react';
import wilsonBanner from '../images/wilsonBanner.png'

class Navbar extends Component {
    render() {
        return (
            <nav className=" container navbar navbar-expand-lg navbar-dark">
                <div>
                    <a className="navbar-brand"><img src={wilsonBanner} alt="wilson electronics" /></a>
                </div>
            </nav>
            )
    }
}

export default Navbar;