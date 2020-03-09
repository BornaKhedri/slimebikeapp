import React, { Component } from 'react'

class Location extends Component {
    render() {
        return (
            <div>
                <div className="card">
                    <h1 className="text-center"><br />Select the location of bike/scooter</h1>

                    <div id="map"></div>

                    <button type="button" className="btn btn-primary text-center d-flex align-items-center mx-auto fit" id="location_continue">Continue</button>

                </div>
            </div>
        )
    }
}

export default Location
