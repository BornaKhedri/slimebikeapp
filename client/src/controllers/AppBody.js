import React, { Component } from 'react'
import NavBar from './NavBar'

class AppBody extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             currentState: 'init'
        }
    }
    
    render() {
        return (
            <div>
                <NavBar></NavBar>
            </div>
        )
    }
}

export default AppBody
