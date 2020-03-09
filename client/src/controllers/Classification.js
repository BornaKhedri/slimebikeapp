import React, { Component } from 'react'

class Classification extends Component {
    render() {
        return (
            <div>
                <div className="card">
                    <div className="center">
                        <div className="row" id="image_control">
                            <div className="col-md-6 col-md-offset-3 center">
                                <div className="btn-container">

                                    <h1 className="imgupload"><i className="fa fa-file-image-o"></i></h1>
                                    <p id="namefile">Only pics allowed! (jpg,jpeg,bmp,png)</p>
                                    <button type="button" id="btnup" className="btn btn-primary btn-lg">Browse for your pic!</button>
                                    <input type="file" accept="image/*" capture="environment" id="wheel_image" name="wheel_image" value="" />
                                </div>
                            </div>
                        </div>

                        {/* <video id="player" controls autoplay className="card-img-top"></video>
                    <button id="capture"
                        className="btn btn-primary text-center d-flex align-items-center mx-auto">Capture</button> */}
                        <canvas id="canvas"></canvas>
                    </div>
                    <div className="card-body">
                        <p className="card-text">Select all parking infractions that apply</p>

                        <div className="" id="infraction_list">

                        </div>
                    </div>
                    <div className="card-body">
                        <p className="card-text">Choose the company</p>
                        <div className="card-text" id="company_list">

                        </div>
                    </div>
                    <br />

                    <button type="button" className="btn btn-primary text-center d-flex align-items-center mx-auto" id="classification_continue">Continue</button>

                </div>
            </div>
            
        )
    }
}

export default Classification
