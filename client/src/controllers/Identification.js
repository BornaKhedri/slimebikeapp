import React, { Component } from 'react'

class Identification extends Component {

    constructor(props) {
        super(props)

    }

    socket_submit() {

    }

    render() {
        return (
            <div>
                <div className="card">
                    <h1 className="text-center" ><br />Optionally, please also scan the vehicle's QR code
                </h1>
                    <div>
                        <button className="button" id="startButton">Start</button>
                        <button className="button" id="resetButton">Reset</button>
                    </div>
                    <div id="sourceSelectPanel" >
                        <label htmlFor="sourceSelect">Change video source:</label>
                        <select id="sourceSelect" >
                        </select>
                    </div>

                    <label>Result:</label>
                    <pre><code id="result"></code></pre>
                    <video id="video" className="d-flex align-items-center mx-auto" width="300" height="200" ></video>
                    <button className="btn btn-primary text-center d-flex align-items-center mx-auto" onClick={() => this.socket_submit()} >Submit</button>


                </div>
            </div>
        )
    }
}

export default Identification
